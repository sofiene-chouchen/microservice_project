const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const userProtoPath = "./user.proto";
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition).User;

const userService = {
  searchUsers: async (call, callback) => {
    const { query } = call.request;
    try {
      const users = await prisma.user.findMany();
      callback(null, { users: users });
    } catch (error) {
      callback(error);
    }
  },

  createUser: async (call, callback) => {
    const { name, prenom } = call.request;

    try {
      const createdOrder = await prisma.user.create({
        data: {
          name,
          prenom,
        },
      });

      callback(null, { user: [createUser] });
    } catch (error) {
      callback({ code: 500, message: "Internal server error" });
    }
  },
};
const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);
const port = 50051;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
  }
);
