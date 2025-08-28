const { Server } = require("socket.io");
const socketAuthMiddleware = require("../Middleware/socketMiddleware");
const { makeRedisClient } = require("./redisClient");

let io;
const pubClient = makeRedisClient();
const subClient = pubClient.duplicate();

(async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed ", err);
  }
})();

const setupSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(socketAuthMiddleware);

  subClient.subscribe("docChannel", (message) => {
    const parsed = JSON.parse(message);
    const { docId, socketId, data,userId } = parsed;

    io.to(docId).except(socketId).emit("doc:update", {
      from: userId,
      data,
    });
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id, "User:", socket.user?.username);

    socket.on("join:doc", ({ docId }) => {
      socket.join(docId);


      socket.to(docId).emit("user:joined", {
        user: { _id: socket.user._id, username: socket.user.username },
        socketId: socket.id
      });

      const sockets = io.sockets.adapter.rooms.get(docId) || [];
      const usersInDoc = [...sockets]
        .map((sId) => {
          const s = io.sockets.sockets.get(sId);
          return s?.user
            ? { _id: s.user._id, username: s.user.username, socketId: s.id }
            : null;
        })
        .filter(Boolean);

      socket.emit("doc:activeUsers", usersInDoc);
    });

    socket.on("doc:update", async ({ docId, data }) => {

        const userId = secket.user._id;
      if (!data?.title || !data?.content) {
        return console.log("Missing title or content in doc:update");
      }
      pubClient.publish(
        "docChannel",
        JSON.stringify({ docId, socketId: socket.id, data,userId })
      );

      const document = await Document.findById(docId);

      await DocumentVersion.create({
        documentId: document._id,
        title: document.title,
        content: document.content,
        createdBy: socket.user._id,
      });

      document.title = data.title;
      document.content = data.content;
      await document.save();
    });




    socket.on("cursor:move", ({ docId, cursor }) => {
      socket.to(docId).emit("cursor:move", {
        userId: socket.user._id,
        cursor,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      socket.rooms.forEach((docId) => {
        if (docId !== socket.id) {
          socket.to(docId).emit("user:left", {
            userId: socket.user._id,
            socketId: socket.id,
          });
        }
      });
    });
  });
};

module.exports = setupSocketServer;
