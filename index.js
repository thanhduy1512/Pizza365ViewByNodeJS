const express = require("express");

const path = require("path");

const app = express();

const port = 8000;

const companyRouter = require("./app/routes/companyRouter");

app.use(express.static(__dirname + "/views/pizza365.v1.9"));

app.get("/example", (req, res) => {
  res.sendFile(__dirname + "/views/example-call.html");
});

app.get("/pizza", (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + "/views/pizza365.v1.9/index.html");
});

app.use("/", companyRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
