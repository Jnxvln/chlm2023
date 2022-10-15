// ROUTER /api/users

const express = require("express");
const router = express.Router();
const {
  getMe,
  registerUser,
  loginUser,
} = require("../controllers/userController");

router.get("/", getMe);
router.post("/", registerUser);
router.post("/", loginUser);

module.exports = router;
