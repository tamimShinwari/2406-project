const express = require("express");
const server = express();

server.use(express.static("public"));
server.use(require("./routes"));

server.listen(3000, () => { console.log("Server listening at port 3000") })