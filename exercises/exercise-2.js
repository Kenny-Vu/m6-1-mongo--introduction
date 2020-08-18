const { MongoClient } = require("mongodb");

const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("exercise-1");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);
    if (r.insertedCount === 1) {
      res.status(201).json({ status: 201, data: req.body });
    } else
      res
        .status(500)
        .json({ status: 500, data: req.body, message: err.message });
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise-1");
  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

module.exports = { createGreeting, getGreeting };
