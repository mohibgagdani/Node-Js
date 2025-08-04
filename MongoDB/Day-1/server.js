const { MongoClient } = require("mongodb");

async function run() {
  const client = new MongoClient("mongodb://127.0.0.1");

  try {
    await client.connect();

    const db = client.db("mongodb_nodejs_db");
    const userCollection = db.collection("users");

    // Insert one document
    await userCollection.insertOne({ name: "vinod technical", age: 31 });

    // Insert multiple documents
    await userCollection.insertMany([
      { name: "vinod technical", age: 31 },
      { name: "vinod technical", age: 31 },
      { name: "vinod technical", age: 31 }
    ]);

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

run();