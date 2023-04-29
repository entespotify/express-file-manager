const typeDefs = `
  type Transaction {
    id: ID
    title: String
    description: String
    amount: Int
  }

  type Query {
    transactions: [Transaction]
  }
`;

module.exports = typeDefs;