/**
 * todos routers
 */
const Todo = require("../models/todo");
const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user");
const multer = require("multer");
const path = require("node:path");
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/**
 * defining the router
 */
const router = express.Router();

/** start insert a single todo */
router.post("/register", upload.array("files", 12), async (request, reply) => {
  try {
    const user = await User.findById(request.body.user);

    let urls = [];

    if (!user) {
      reply.status(404).send({ message: "User not found" });
    } else {
      const images = request.files;

      images.map((image) => {
        urls.push(image.path);
      });

      const todo = new Todo(request.body);
      todo.files = urls;
      await todo.save();

      reply.send({ message: "Todo Added!" });
    }
  } catch (err) {
    reply.status(500).send({ message: "Error inserting todo " + err.message });
  }
});
/** end insert a single todo */

/** start get all todos */
router.get("/", async (request, reply) => {
  try {
    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "username role phone" });
    reply.send(todos);
  } catch (error) {
    reply.status(500).send({ message: "Error getting todos " + error.message });
  }
});
/** end get all todos */

/** start get todo by id */
router.get("/:id", async (request, reply) => {
  // validate todo id
  if (!mongoose.isValidObjectId(request.params.id)) {
    reply.status(400).send({ message: "Invalid todo id" });
  }
  try {
    const todo = await Todo.findById(request.params.id)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "username role phone" });
    if (!todo) {
      reply.status(404).send({ message: "todo not found" });
    } else {
      reply.send(todo);
    }
  } catch (error) {
    reply.status(500).send({ message: "Error getting todo " + error.message });
  }
});
/** end get todo by id */

/** start get todos by userid */
router.get("/get/user", async (request, reply) => {
  try {
    const todos = await Todo.find({ user: request.query.user })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "username role phone" });
    reply.send(todos);
  } catch (error) {
    reply.status(500).send({ message: "Error getting todos " + error.message });
  }
});
/** end get todos by userid */

/** get todos using server side pagination */
router.get("/get/pagination", async (request, reply) => {
  const { page, limit } = request.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  try {
    const totalTodos = await Todo.countDocuments();
    const totalPages = Math.ceil(totalTodos / pageSize);

    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    if (!todos) {
      return reply.status(404).json({ message: "No todos found" });
    } else {
      return reply.send({
        totalPages: totalPages,
        data: todos,
        hasMore: page < totalPages,
      });
    }
  } catch (error) {
    return reply.status(500).json({ message: error.message });
  }
});
/** get todos using server side pagination */

/** start get todos by priority */
router.get("/get/priority", async (request, reply) => {
  try {
    const todos = await Todo.find({ priority: request.query.priority })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "username role phone" });
    reply.send(todos);
  } catch (error) {
    reply.status(500).send({ message: "Error getting todos " + error.message });
  }
});
/** end get todos by priority */

/** start delete a todo by id */
router.delete("/:id", async (request, reply) => {
  try {
    const todoDel = await Todo.findByIdAndDelete(request.params.id);
    if (!todoDel) {
      reply.send({ message: "todo already deleted" });
    } else {
      reply.send({ message: "todo deleted" });
    }
  } catch (err) {
    reply
      .status(500)
      .send({
        message: `Error deleting todo ${request.params.id} ` + err.message,
      });
  }
});
/** end delete a todo by id */

/** start update todo by id */
router.put("/:id", async (request, reply) => {
  try {
    const todo = await Todo.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    if (!todo) {
      reply.send({ message: "todo not found!" });
    } else {
      reply.send({ message: "todo updated!!!" });
    }
  } catch (err) {
    reply
      .status(500)
      .send({
        message: `Error updating todo ${request.params.id} ` + err.message,
      });
  }
});
/** end update todo by id */

/** start count all todos */
router.get("/get/count", async (request, reply) => {
  try {
    const todocount = await Todo.countDocuments();
    if (!todocount) {
      return reply.send({ TotalTodos: 0 });
    } else {
      return reply.send({ TotalTodos: todocount });
    }
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
});
/** end count all todos */

/** start count todos by priority */
// http://localhost:4050/todo/count/priority?priority=low
router.get("/count/priority", async (request, reply) => {
  try {
    const todocount = await Todo.find({
      priority: request.query.priority,
    }).countDocuments();
    if (!todocount) {
      return reply.send({ TotalTodos: 0 });
    } else {
      return reply.send({ TotalTodos: todocount });
    }
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
});
/** end count todos by priority*/

module.exports = router;
