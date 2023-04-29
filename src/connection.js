const mysql = require('knex')({
    client: 'mysql',
    connection: {
      host : 'db4free.net',
      // port : 3306,
      user : 'asnhkiivta',
      password : 'Shivani@19',
      database : 'expense_tracker'
    },
    searchPath: ['knex', 'public'],
  });

  module.exports = { knex }