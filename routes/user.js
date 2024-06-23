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

/**
 * get user by id
 */
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "invalid user id" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else {
      return res.send(user);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * delete a user
 */
router.delete(`/:id`, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      return res.status(200).json({ message: "user deleted" });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * update an existing user
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "invalid user id" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(400).json({ message: "user cannot be updated" });
    } else {
      return res.send(user);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * user log in
 */
router.post(`/login`, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const secret = process.env.SECRET;

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ userid: user.id }, secret, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          id: user.id,
          role: user.role,
          token: token,
        });
      } else {
        return res
          .status(400)
          .json({ message: "password/username is incorrect" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * update pasword
 */
router.put(`/changepwd/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "invalid user id" });
  }
  try {
    const userFind = await User.findById(req.params.id);
    if (bcrypt.compareSync(req.body.oldPassword, userFind.password)) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { password: bcrypt.hashSync(req.body.password, 10) },
        {
          new: true,
        }
      );
      if (!user) {
        return res.status(400).json({ message: "password cannot be updated" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Password changed" });
      }
    } else {
      return res.status(500).json({ message: "wrong old password" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * count users
 */
router.get(`/get/count`, async (req, res) => {
  const usercount = await User.countDocuments();

  if (!usercount) {
    return res.send({ TotalUsers: 0 });
  } else {
    return res.send({ TotalUsers: usercount });
  }
});

/**
 * count users by role
 * http://localhost:4050/api/v0/user/get/count/role?role=admin
 */
router.get(`/get/count/role`, async (req, res) => {
  const usercount = await User.find({
    role: req.query.role,
  }).countDocuments();

  if (!usercount) {
    return res.send({ TotalUsers: 0 });
  } else {
    return res.send({ TotalUsers: usercount });
  }
});

module.exports = router;
