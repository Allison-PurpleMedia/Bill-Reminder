const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const reminders = sequelize.define(
    'reminders',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      reminder_date: {
        type: DataTypes.DATE,
      },

      message: {
        type: DataTypes.TEXT,
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

  reminders.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.reminders.belongsTo(db.bills, {
      as: 'bill',
      foreignKey: {
        name: 'billId',
      },
      constraints: false,
    });

    db.reminders.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.reminders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.reminders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return reminders;
};
