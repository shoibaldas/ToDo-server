const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vrrg6hy.mongodb.net/?retryWrites=true&w=majority`;
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri);

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
  }
}

dbConnect();
const allEmployee = client.db("toDo").collection("employeeList");
const allTask = client.db("toDo").collection("taskList");

app.post("/employees", async (req, res) => {
  try {
    const employee = req.body;
    const result = await allEmployee.insertOne(employee);
    if (result) {
      res.send({
        success: true,
        message: "Successfully Added.",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const cursor = allEmployee.find({});
    const employees = await cursor.toArray();

    res.send({
      success: true,
      message: "Data fetched successfully.",
      data: employees,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const task = req.body;
    const result = await allTask.insertOne(task);
    if (result) {
      res.send({
        success: true,
        message: "Successfully Added.",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const cursor = allTask.find({});
    const tasks = await cursor.toArray();

    res.send({
      success: true,
      message: "Data fetched successfully.",
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/", async (req, res) => {
  res.send("ToDo API is running");
});

app.listen(port, () => {
  console.log(`ToDo API is running on PORT: ${port}`);
});
