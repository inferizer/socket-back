const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const { Server } = require("socket.io");
const mobileFormat = require("./mobileFormat");

const server = http.createServer(app);

app.use(cors());
app.use(morgan("dev"));

const io = new Server(server, {
  // must use cors setting middleware handle with api connect issue
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket) => {
  console.log(`User: ${socket.id} connected`);

  // room for shop & customer
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User: ${socket.id} Joined room:${data}`);
  });

  // create reservation and return queue ticket to customer when got request
  socket.on("booking", (data) => {
    console.log(data);
    io.to(`${data.userId}`)
      .to(`${data.shopName}`)
      .emit(
        "ticket",
        // (mocking) DB_reservation
        {
          data: "Online Queue Detail",
          id: data.userId,
          name: data.name,
          qNumber: 2,
          date: dayjs().format("DD MMMM YYYY"),
          time: dayjs().format("h:mm A"),
        }
      );
  });
  // create reservation and return queue ticket to customer when got request
  socket.on("booking for customer", (onstieData) => {
    io.to(`${onstieData.shopName}`).emit(
      "onsite queue",
      // (mocking) DB_reservation
      {
        data: "Onsite Queue",
        id: onstieData.userId,
        name: onstieData.name,
        mobile: mobileFormat(onstieData.mobile),
        qNumber: 3,
        date: dayjs().format("DD MMMM YYYY"),
        time: dayjs().format("h:mm A"),
      }
    );
  });

  //cancel booking and delete DB_reservation
  socket.on("cancel", (cancelInfo) => {
    io.to(`${cancelInfo.shopName}`).emit("cancel queue", {
      userId: cancelInfo.userId,
    });
  });

  //disconnect status
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000.");
});

// ## open socket
// io.on("event",() => {})

// ##
// io.to("room name").emit("some event")
