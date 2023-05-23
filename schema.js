const { gql } = require("@apollo/server");
const typeDefs = `#graphql
type Order {
id: String!
name: String!
description: String!
}
type User {
id: String!
name: String!
prenom: String!
}
type Query {
orders: [Order]
users: [User]
}
type Mutation {
  createUser( name: String!, prenom:String!): User
  createOrder(name: String!, description: String!): Order
 
}
 
`;
module.exports = typeDefs;
