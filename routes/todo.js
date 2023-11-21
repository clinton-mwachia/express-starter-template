/**
 * todos routers
 */
const Todo = require("../models/todo");
const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user");

/**
 * defining the router
 */
const router = express.Router();

/** start insert a single todo */
router.post("/register", async (request, reply) => {
  try {
    const user = await User.findById(request.body.user);

    if (!user) {
      reply.status(404).send({ message: "User not found" });
    } else {
      const todo = new Todo(request.body);
      await todo.save();

      reply.send({ message: "Todo Added!" });
    }
  } catch (err) {
    reply.status(500).send({ message: "Error inserting todo", err });
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
    reply.status(500).send({ message: "Error getting todos", error });
  }
});
/** end get all todos */

module.exports = router;
