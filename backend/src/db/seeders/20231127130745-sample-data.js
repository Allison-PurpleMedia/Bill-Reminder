const db = require('../models');
const Users = db.users;

const Bills = db.bills;

const Reminders = db.reminders;

const Organizations = db.organizations;

const BillsData = [
  {
    bill_name: 'Electricity Bill',

    amount: 100.5,

    due_date: new Date('2023-11-01T00:00:00Z'),

    status: 'paid',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    bill_name: 'Water Bill',

    amount: 30.75,

    due_date: new Date('2023-11-05T00:00:00Z'),

    status: 'part-paid',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    bill_name: 'Internet Bill',

    amount: 50,

    due_date: new Date('2023-11-10T00:00:00Z'),

    status: 'part-paid',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    bill_name: 'Rent',

    amount: 1200,

    due_date: new Date('2023-11-15T00:00:00Z'),

    status: 'unpaid',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const RemindersData = [
  {
    reminder_date: new Date('2023-10-25T00:00:00Z'),

    message: 'Reminder: Electricity Bill due soon',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    reminder_date: new Date('2023-10-30T00:00:00Z'),

    message: 'Reminder: Water Bill due soon',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    reminder_date: new Date('2023-11-03T00:00:00Z'),

    message: 'Reminder: Internet Bill due soon',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    reminder_date: new Date('2023-11-10T00:00:00Z'),

    message: 'Reminder: Rent due soon',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Org One',
  },

  {
    name: 'Org Two',
  },

  {
    name: 'Org Three',
  },

  {
    name: 'Org Four',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setOrganization) {
    await User3.setOrganization(relatedOrganization3);
  }
}

async function associateBillWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Bill0 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Bill0?.setUser) {
    await Bill0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Bill1 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Bill1?.setUser) {
    await Bill1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Bill2 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Bill2?.setUser) {
    await Bill2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Bill3 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Bill3?.setUser) {
    await Bill3.setUser(relatedUser3);
  }
}

async function associateBillWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Bill0 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Bill0?.setOrganization) {
    await Bill0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Bill1 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Bill1?.setOrganization) {
    await Bill1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Bill2 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Bill2?.setOrganization) {
    await Bill2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Bill3 = await Bills.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Bill3?.setOrganization) {
    await Bill3.setOrganization(relatedOrganization3);
  }
}

async function associateReminderWithBill() {
  const relatedBill0 = await Bills.findOne({
    offset: Math.floor(Math.random() * (await Bills.count())),
  });
  const Reminder0 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Reminder0?.setBill) {
    await Reminder0.setBill(relatedBill0);
  }

  const relatedBill1 = await Bills.findOne({
    offset: Math.floor(Math.random() * (await Bills.count())),
  });
  const Reminder1 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Reminder1?.setBill) {
    await Reminder1.setBill(relatedBill1);
  }

  const relatedBill2 = await Bills.findOne({
    offset: Math.floor(Math.random() * (await Bills.count())),
  });
  const Reminder2 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Reminder2?.setBill) {
    await Reminder2.setBill(relatedBill2);
  }

  const relatedBill3 = await Bills.findOne({
    offset: Math.floor(Math.random() * (await Bills.count())),
  });
  const Reminder3 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Reminder3?.setBill) {
    await Reminder3.setBill(relatedBill3);
  }
}

async function associateReminderWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Reminder0 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Reminder0?.setOrganization) {
    await Reminder0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Reminder1 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Reminder1?.setOrganization) {
    await Reminder1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Reminder2 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Reminder2?.setOrganization) {
    await Reminder2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Reminder3 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Reminder3?.setOrganization) {
    await Reminder3.setOrganization(relatedOrganization3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Bills.bulkCreate(BillsData);

    await Reminders.bulkCreate(RemindersData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateBillWithUser(),

      await associateBillWithOrganization(),

      await associateReminderWithBill(),

      await associateReminderWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bills', null, {});

    await queryInterface.bulkDelete('reminders', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
