const { MongoClient } = require("mongodb");

const assert = require("assert");
const { start } = require("repl");

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

const getGreetings = async (req, res) => {
  let start = req.query.start ? Number(req.query.start) : 0;
  let limit = req.query.limit ? Number(req.query.limit) : 25;

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise-1");

  try {
    let result = await db.collection("greetings").find();
    //if the length of the collection is greater than the limit from the starting point then set limit as the difference between collection length and the starting point of the query
    if (result.count() < start + limit) {
      limit = (await result.count()) - start;
    }
    result = await result.skip(start).limit(limit).toArray();
    res.status(200).json({ status: 200, data: result });
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise-1");

  const { _id } = req.params;
  // count before deletion
  const count = await db.collection("greetings").countDocuments();
  //deletion
  await db.collection("greetings").findOneAndDelete({ _id });
  //count after deletion
  const newCount = await db.collection("greetings").countDocuments();
  result = await db.collection("greetings").find().toArray();
  if (newCount === count - 1) {
    res.status(204).json({ status: 204, data: result });
  } else {
    res.status(400).json({ status: 400, data: result });
  }
  client.close();
};

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting };
