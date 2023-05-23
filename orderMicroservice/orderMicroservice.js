const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const orderProtoPath = "./order.proto";
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).Order;
// Implémenter le service de séries TV
const orderService = {
  getOrder: async (call, callback) => {
    const { id } = call.request;
    try {
      const order = await prisma.order.findUnique({ where: { id: id } });
      if (order) {
        callback(null, { order });
      } else {
        callback({ code: 404, message: "order not found" });
      }
    } catch (error) {
      callback({ code: 500, message: "Internal server error" });
    }
  },
  searchOrders: async (call, callback) => {
    const { query } = call.request;
    try {
      const orders = await prisma.order.findMany();
      callback(null, { orders: orders });
    } catch (error) {
      callback(error);
    }
  },
  createOrder: async (call, callback) => {
    const { name, description } = call.request;

    try {
      // Create the order using Prisma
      const createdOrder = await prisma.order.create({
        data: {
          name,
          description,
        },
      });

      // Send the created order as a response
      callback(null, { order: [createdOrder] });
    } catch (error) {
      callback({ code: 500, message: "Internal server error" });
    }
  },

  // Ajouter d'autres méthodes au besoin
};
// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(orderProto.OrderService.service, orderService);
const port = 50052;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Échec de la liaison du serveur:", err);
      return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
  }
);
