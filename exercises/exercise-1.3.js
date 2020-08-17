const { MongoClient, db } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const { dbName } = req.params; // dbName === "exercise-1"
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db(dbName);

  const users = await db.collection("users").find().toArray();
  console.log(users);
  if (users.length > 0) {
    res.status(200).json(users);
  } else res.status(404).type("txt").send("🤷‍♂️");

  client.close();
};

module.exports = { getUsers };
