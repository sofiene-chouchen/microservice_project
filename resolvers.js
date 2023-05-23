const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Charger les fichiers proto pour les films et les séries TV
const orderProtoPath = "./orderMicroservice/order.proto";
const userProtoPath = "./userMicroservice/user.proto";

const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).Order;
const userProto = grpc.loadPackageDefinition(userProtoDefinition).User;

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
  Query: {
    order: (_, { id }) => {
      const client = new orderProto.OrderService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.getOrder({ id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else if (response.order) {
            // If the response contains the 'order' field
            resolve({
              id: response.order.id,
              name: response.order.name,
              description: response.order.description,
            });
          } else {
            // If the response does not contain the 'order' field
            reject(new Error("Order not found"));
          }
        });
      });
    },
    orders: () => {
      // Effectuer un appel gRPC au microservice de films
      const client = new orderProto.OrderService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.searchOrders({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.orders);
          }
        });
      });
    },
    user: (_, { id }) => {
      // Effectuer un appel gRPC au microservice de séries TV
      const client = new userProto.UserService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.getUser({ userId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.user);
          }
        });
      });
    },
    users: () => {
      // Effectuer un appel gRPC au microservice de séries TV
      const client = new userProto.UserService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.searchUsers({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.users);
          }
        });
      });
    },
  },
  Mutation: {
    createUser: (_, { name, prenom }) => {
      // Effectuer un appel gRPC au microservice d'utilisateurs
      const clientUser = new userProto.UserService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );

      return new Promise((resolve, reject) => {
        clientUser.createUser(
          { name: name, prenom: prenom },
          (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.user);
            }
          }
        );
      });
    },
    createOrder: (_, { name, description }) => {
      const clientOrder = new orderProto.OrderService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );

      const orderData = { name: name, description: description };

      return new Promise((resolve, reject) => {
        clientOrder.createOrder(orderData, (err, response) => {
          if (err) {
            reject(err);
          } else {
            const order = {
              id: response.order.id,
              name: response.order.name,
              description: response.order.description,
            };
            resolve(order);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
