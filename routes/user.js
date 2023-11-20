/**
 * users routes
 * http://localhost:4050/api/v0/user
 */
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

/**
 * defining the router
 */
const router = express.Router();

/**
 * register user
 */
router.post("/register", async (req, res) => {
  try {
    let obj = new User(req.body);
    obj.password = bcrypt.hashSync(req.body.password, 10);
    const user = await obj.save();
    if (!user) {
      return res.status(400).json({ message: "cannot register new user" });
    } else {
      return res.send(user);
    }
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
});

/**
 * get all users
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No user(s) found" });
    } else {
      return res.send(users);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
