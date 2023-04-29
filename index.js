import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// import { mysql } from "./src/connection";
// import pkg from 'knex';
// const { knex } = pkg;
// import { getAllTransactions } from "./src/data-sources/transaction";
//import { transactionResolvers as resolvers } from "./src/resolvers";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

// const { createStore } = require("./utils");

// const store = createStore();

import Knex from 'knex'

const mysql = Knex({
  client: 'mysql',
  connection: {
    host : 'db4free.net',
    // port : 3306,
    user : 'asnhkiivta',
    password : 'Shivani@19',
    database : 'expense_tracker'
    // database: 'expense-tracker-dev-db',
    // host: '34.68.145.126',
    // user: 'p960736242304-gjtlmh@gcp-sa-cloud-sql.iam.gserviceaccount.com',
    // password: 'pass@expense'
  },
  searchPath: ['knex', 'public'],
  // migrations: {
  //   directory: path.join(__dirname, 'migrations')
  // }
});


const typeDefs = `
  type Transaction {
    id: ID
    title: String
    description: String
    amount: Int
  }

  type Query {
    transactions: [Transaction]
    transactionByID(id:ID!): [Transaction]
  }

  type Mutation {
    addNewTransaction(id:ID!,title:String,description:String,amount:Int): [Transaction]
    updateTransaction(id:ID!,title:String,description:String,amount:Int): [Transaction]
    deleteTransaction(id:ID!,title:String,description:String,amount:Int): [Transaction]
  }
`;

async function getAllTransactions() {
  const result = await mysql('transactions').select('*');
  return result;
}

async function getTransactionByID(id) {
  const result = await mysql('transactions').select('*').where('id',id);
  return result;
}

async function addNewTransaction(id,title,description,amount) {
  await mysql('transactions').insert({title: title, id: id, description:description,amount:amount});
  const result = getTransactionByID(id)
  return result;
}

async function updateTransaction(id,title,description,amount) {
  await mysql('transactions').where('id', id).update({title: title, id: id, description:description,amount:amount});
  const result = getTransactionByID(id)
  return result;
}

async function deleteTransaction(id) {
  const result = getTransactionByID(id)
  await mysql('transactions').where('id', id)
  .del();
  return result;
}

const resolvers = {
  Query: {
    transactions: async() => await getAllTransactions(),
    transactionByID: async(root,args,context,info) => await getTransactionByID(args.id),
  },
  Mutation: {
    addNewTransaction: async(root,args,context,info) => await addNewTransaction(args.id,args.title,args.description,args.amount),
    updateTransaction: async(root,args,context,info) => await updateTransaction(args.id,args.title,args.description,args.amount),
    deleteTransaction: async(root,args,context,info) => await deleteTransaction(args.id)
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  // dataSources: () => ({
  //   TransactionAPI: new TransactionAPI(),
  // }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
