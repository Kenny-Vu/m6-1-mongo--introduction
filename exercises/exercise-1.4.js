const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParse: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const newUser = req.body;
  console.log("newUser:" + " " + newUser);
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise-1");

  await db.collection("users").insertOne(newUser);
  const users = await db.collection("users").find().toArray(); //we'll send back all users to show that the request worked

  res.status(201).json({ message: "success", users: users });

  client.close();
};

module.exports = { addUser };
