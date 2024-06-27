const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class BillsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const bills = await db.bills.create(
      {
        id: data.id || undefined,

        bill_name: data.bill_name || null,
        amount: data.amount || null,
        due_date: data.due_date || null,
        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await bills.setUser(data.user || null, {
      transaction,
    });

    await bills.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return bills;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const billsData = data.map((item, index) => ({
      id: item.id || undefined,

      bill_name: item.bill_name || null,
      amount: item.amount || null,
      due_date: item.due_date || null,
      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const bills = await db.bills.bulkCreate(billsData, { transaction });

    // For each item created, replace relation files

    return bills;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const bills = await db.bills.findByPk(id, {}, { transaction });

    await bills.update(
      {
        bill_name: data.bill_name || null,
        amount: data.amount || null,
        due_date: data.due_date || null,
        status: data.status || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await bills.setUser(data.user || null, {
      transaction,
    });

    await bills.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return bills;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const bills = await db.bills.findByPk(id, options);

    await bills.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await bills.destroy({
      transaction,
    });

    return bills;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const bills = await db.bills.findOne({ where }, { transaction });

    if (!bills) {
      return bills;
    }

    const output = bills.get({ plain: true });

    output.reminders_bill = await bills.getReminders_bill({
      transaction,
    });

    output.user = await bills.getUser({
      transaction,
    });

    output.organization = await bills.getOrganization({
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
        model: db.users,
        as: 'user',
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

      if (filter.bill_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('bills', 'bill_name', filter.bill_name),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              due_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              due_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.amountRange) {
        const [start, end] = filter.amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.due_dateRange) {
        const [start, end] = filter.due_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            due_date: {
              ...where.due_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            due_date: {
              ...where.due_date,
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

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
        };
      }

      if (filter.user) {
        var listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
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
          count: await db.bills.count({
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
      : await db.bills.findAndCountAll({
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
          Utils.ilike('bills', 'bill_name', query),
        ],
      };
    }

    const records = await db.bills.findAll({
      attributes: ['id', 'bill_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['bill_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.bill_name,
    }));
  }
};
