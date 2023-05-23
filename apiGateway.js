const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const orderProtoPath = "./orderMicroservice/order.proto";
const userProtoPath = "./userMicroservice/user.proto";
const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const app = express();
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
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
  app.use(express.json());
});
app.get("/orders", (req, res) => {
  const client = new orderProto.OrderService(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );
  client.searchOrders({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.orders);
    }
  });
});

app.post("/orders", (req, res) => {
  const { name, description } = req.query;

  const client = new orderProto.OrderService(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );

  client.createOrder({ name, description }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.order);
    }
  });
});

app.get("/users", (req, res) => {
  const client = new userProto.UserService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  client.searchUsers({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.users);
    }
  });
});

app.post("/user", (req, res) => {
  const { name, prenom } = req.query;

  const clientUser = new userProto.UserService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  clientUser.createUser({ name, prenom }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.user);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
