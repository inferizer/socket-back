const express = require("express");
const http = require("http");
const ioInit = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = ioInit(server);

const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));

const bookingQueue = [];

io.on("connection", (socket) => {
  console.log("A new client has connected.");

  // Assign the client a unique ID.
  const clientId = uuidv4();

  // Add the client to the booking queue.
  bookingQueue.push(clientId);

  // Emit an event to the client with their client ID.
  socket.emit("client id", clientId);

  // Listen for requests from the client to get their current queue number.
  socket.on("get current queue number", () => {
    // Get the client's current queue number.
    const currentQueueNumber = bookingQueue.indexOf(clientId);

    // Emit an event to the client with their current queue number.
    socket.emit("current queue number", currentQueueNumber);
  });

  // When the client disconnects, remove them from the booking queue.
  socket.on("disconnect", () => {
    bookingQueue.splice(bookingQueue.indexOf(clientId), 1);
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000.");
});
