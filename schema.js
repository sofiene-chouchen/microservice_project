const { gql } = require("@apollo/server");
// Définir le schéma GraphQL
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
order(id: String!): Order
orders: [Order]
user(id: String!): User
users: [User]
}
type Mutation {
  createUser( name: String!, prenom:String!): User
  createOrder(name: String!, description: String!): Order
 
}
 
`;
module.exports = typeDefs;
