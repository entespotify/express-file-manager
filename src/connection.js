import Knex from "knex";

const mysql = Knex({
  client: "mysql",
  connection: {
    host: "db4free.net",
    // port : 3306,
    user: "asnhkiivta",
    password: "Shivani@19",
    database: "expense_tracker",
    // database: 'expense-tracker-dev-db',
    // host: '34.68.145.126',
    // user: 'p960736242304-gjtlmh@gcp-sa-cloud-sql.iam.gserviceaccount.com',
    // password: 'pass@expense'
  },
  searchPath: ["knex", "public"],
  // migrations: {
  //   directory: path.join(__dirname, 'migrations')
  // }
});

export default mysql;