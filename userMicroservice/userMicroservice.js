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
  getUser: async (call, callback) => {
    const { user_id } = call.request;
    try {
      const user = await prisma.user.findUnique({ where: { id: user_id } });
      if (user) {
        callback(null, { user });
      } else {
        callback({ code: 404, message: "User not found" });
      }
    } catch (error) {
      callback({ code: 500, message: "Internal server error" });
    }
  },

  searchUsers: async (call, callback) => {
    const { query } = call.request;
    try {
      const users = await prisma.user.findMany();
      callback(null, { users: users });
    } catch (error) {
      callback(error);
    }
  },

  createUser: async (_, { name, prenom }) => {
    const clientUser = new userProto.UserService(
      "localhost:50051",
      grpc.credentials.createInsecure()
    );

    try {
      const response = await new Promise((resolve, reject) => {
        clientUser.createUser(
          { name: name, prenom: prenom },
          (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          }
        );
      });

      return response.user ? [response.user] : [];
    } catch (error) {
      throw new Error(error);
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
