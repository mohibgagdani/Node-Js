import { useState } from "react";

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://jadejamanvendrasinh79:Monty7777@cluster0.dhapzsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const express = require("express");
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const students = [
  { name: "kunj", age: 22, course: "fsd" },
  { name: "maan", age: 19, course: "fsd" },
  { name: "mohit", age: 20, course: "fsd" },
];
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/add-user", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("mydb"); // change this to your DB name
    const collection = database.collection("users"); // collection name
    const userData = req.body;
    await collection.insertOne(userData);
    res.send("Data inserted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to insert data");
  } finally {
    await client.close();
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("myDatabase");
    const collection = database.collection("students");

    const result = await collection.insertMany(students);
    console.log("inserted");

    app.post("/click", (req, res) => {
      const newDoc = { name: "hello" };
      students.push(newDoc);
      result = collection.insertMany(newDoc);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port);




