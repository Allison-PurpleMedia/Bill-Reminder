const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class RemindersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.create(
      {
        id: data.id || undefined,

        reminder_date: data.reminder_date || null,
        message: data.message || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await reminders.setBill(data.bill || null, {
      transaction,
    });

    await reminders.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return reminders;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const remindersData = data.map((item, index) => ({
      id: item.id || undefined,

      reminder_date: item.reminder_date || null,
      message: item.message || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const reminders = await db.reminders.bulkCreate(remindersData, {
      transaction,
    });

    // For each item created, replace relation files

    return reminders;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const reminders = await db.reminders.findByPk(id, {}, { transaction });

    await reminders.update(
      {
        reminder_date: data.reminder_date || null,
        message: data.message || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await reminders.setBill(data.bill || null, {
      transaction,
    });

    await reminders.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return reminders;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.findByPk(id, options);

    await reminders.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await reminders.destroy({
      transaction,
    });

    return reminders;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.findOne({ where }, { transaction });

    if (!reminders) {
      return reminders;
    }

    const output = reminders.get({ plain: true });

    output.bill = await reminders.getBill({
      transaction,
    });

    output.organization = await reminders.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.bills,
        as: 'bill',
      },

      {
        model: db.organizations,
        as: 'organization',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.message) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('reminders', 'message', filter.message),
        };
      }

      if (filter.reminder_dateRange) {
        const [start, end] = filter.reminder_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            reminder_date: {
              ...where.reminder_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            reminder_date: {
              ...where.reminder_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.bill) {
        var listItems = filter.bill.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          billId: { [Op.or]: listItems },
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.reminders.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.reminders.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('reminders', 'message', query),
        ],
      };
    }

    const records = await db.reminders.findAll({
      attributes: ['id', 'message'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['message', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.message,
    }));
  }
};
