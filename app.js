const express = require("express");
const todoAPI = require("./todoAPI");
const bodyParser = require("body-parser");
const app = express();

app.set("x-powered-by", false);
app.use(bodyParser.json());

app.get("/", todoAPI.list);

app.post("/", todoAPI.create);

app.put("/:id", todoAPI.change);

app.delete("/:id", todoAPI.delete);

app.post("/:id/toggle", todoAPI.toggle);

app.all("*", (req, res) => {
  res.status(404);
  res.send("Not found");
});

exports.app = app;
