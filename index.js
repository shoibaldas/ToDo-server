const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vrrg6hy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
// const client = new MongoClient(uri);

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
// const allTask = client.db("toDo").collection("taskList");

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
    const employees = await allEmployee.find().toArray();
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

app.put("/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const task = req.body.task;

    const filter = { _id: new ObjectId(employeeId) };
    const update = {
      $set: {
        task: {
          id: task.id,
          name: task.name,
        },
      },
    };

    const updatedEmployee = await allEmployee.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });

    if (updatedEmployee) {
      res.send({
        success: true,
        message: "Task added successfully.",
      });
    } else {
      res.send({
        success: false,
        message: "Employee not found.",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.put("/update/employee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updatedEmployee = req.body;

    delete updatedEmployee._id;

    const filter = { _id: new ObjectId(employeeId) };
    const update = { $set: updatedEmployee };

    const result = await allEmployee.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });

    if (result) {
      res.send({
        success: true,
        message: "Task added successfully.",
      });
    } else {
      res.send({
        success: false,
        message: "Employee not found.",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.delete("/delete/employee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const selectedEmployee = { _id: new ObjectId(employeeId) };

    const result = await allEmployee.deleteOne(selectedEmployee);

    if (result) {
      res.send({
        success: true,
        message: "Task added successfully.",
      });
    } else {
      res.send({
        success: false,
        message: "Employee not found.",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.delete("/delete/task/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await allEmployee.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $unset: { task: "" } },
      { returnOriginal: false }
    );

    if (result) {
      res.send({
        success: true,
        message: "Task deleted successfully.",
      });
    } else {
      res.send({
        success: false,
        message: "Employee not found.",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.put("/update/task/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const task = req.body.task;

    const filter = { _id: new ObjectId(employeeId) };
    const update = { $set: { task: task } };

    const updatedTask = await allEmployee.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });

    if (updatedTask) {
      res.send({
        success: true,
        message: "Task added successfully.",
      });
    } else {
      res.send({
        success: false,
        message: "Employee not found.",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.put("/transfer/employee", async (req, res) => {
  try {
    const updatedTaskList = req.body;

    for (const updatedEmployee of updatedTaskList) {
      const { _id, task } = updatedEmployee;
      const filter = { _id: new ObjectId(_id) };
      const update = { $set: { task: task } };

      const updatedEmployeeResult = await allEmployee.findOneAndUpdate(
        filter,
        update,
        { returnOriginal: false }
      );

      console.log("Updated employee:", updatedEmployeeResult);
    }

    res.send({
      success: true,
      message: "Employee task list updated successfully.",
    });
  } catch (error) {
    console.error("Error:", error);
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
