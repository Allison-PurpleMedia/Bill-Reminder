const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const bills = sequelize.define(
    'bills',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      bill_name: {
        type: DataTypes.TEXT,
      },

      amount: {
        type: DataTypes.DECIMAL,
      },

      due_date: {
        type: DataTypes.DATE,
      },

      status: {
        type: DataTypes.ENUM,

        values: ['unpaid', 'part-paid', 'paid'],
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  bills.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.bills.hasMany(db.reminders, {
      as: 'reminders_bill',
      foreignKey: {
        name: 'billId',
      },
      constraints: false,
    });

    //end loop

    db.bills.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.bills.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.bills.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.bills.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return bills;
};
