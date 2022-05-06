import { DeltaOperation } from "quill";
import { Socket } from "socket.io";
import fs from "fs";

const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("get-document", () => {
    socket.emit("load-document", {
      html: fs.readFileSync("docs/original copy.html").toString(),
    });
  });

  socket.on("save-document", (document) => {
    console.log(document.html);

    if (document.html) {
      fs.writeFileSync("docs/original copy.html", document.html);
    }
  });

  socket.on("send-changes", (delta: DeltaOperation) => {
    console.log(JSON.stringify(delta));
    socket.broadcast.emit("receive-changes", delta);
  });
  console.log("Client connected");
});
