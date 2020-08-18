"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1.3");
const { addUser } = require("./exercises/exercise-1.4");
const { createGreeting, getGreeting } = require("./exercises/exercise-2");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // exercise 1.3
  //Tried to make this endpoint more dynanmic using a req.param. Don't know if this is good practice.
  .get("/:dbName/users", getUsers)
  //exercise 2.3
  .get("/greeting/:_id", getGreeting)
  //exercise 1.4
  .post("/exercise-1/users", addUser)
  //exercise 2.1
  .post("/exercise-2/greeting", createGreeting)

  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
