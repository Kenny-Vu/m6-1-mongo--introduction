const { fs } = require("file-system");
const { MongoClient } = require("mongodb");

const assert = require("assert");
const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercise-1");
    const r = await db.collection("greetings").insertMany(greetings);
    console.log("success!");
    client.close();
  } catch (err) {
    console.log(err.stack);
  }
};

batchImport();
