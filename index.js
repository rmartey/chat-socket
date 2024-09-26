const io = require("socket.io")(8800, {
  cors: {
    origin: "*",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    // if user is not added
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("New user connected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  //   send message
  socket.on("send-message", (data) => {
    console.log("received from socket from client :", data);
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket to :", receiverId);
    console.log("data", data);

    if (user) {
      io.to(user.socketId).emit("receive-message", data);
      console.log("sending data from socket to client", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});
