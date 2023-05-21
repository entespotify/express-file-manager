const typeDefs = `
scalar DateTime

type Transaction {
  id: ID
  title: String
  description: String
  amount: Int
  created_at: DateTime
}

type SumOfTransactions {
  sum: Int
}

enum FilterByOptions {
  gt
  lt
  equals
}

input Filter {
  amount: Int
  filterBy: FilterByOptions!
}

enum SortDirection {
  ASC
  DESC
}

input Sort {
  order: SortDirection!
}

input Search {
  searchTerm: String
}

input Utilities {
  filter: Filter
  sort: Sort
  search: Search
}

type Query {
  transactions(utilities: Utilities): [Transaction]
  transactionByID(id:ID!): [Transaction]
  sumOfTransactions: Int
}

type Mutation {
  addNewTransaction(title:String,description:String,amount:Int): [Transaction]
  updateTransaction(id:ID!,title:String,description:String,amount:Int): [Transaction]
  deleteTransaction(id:ID!,title:String,description:String,amount:Int): [Transaction]
}
`;

export default typeDefs;