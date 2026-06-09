const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  saveCV,
  getCV,
  updateCV,
  deleteCV,
  analyzeSkills,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Protected Routes
router.post("/cv", auth, saveCV);
router.get("/cv/:userId", auth, getCV);
router.post("/analyze", auth, analyzeSkills);
router.put("/cv/:userId", auth, updateCV);
router.delete("/cv/:userId", auth, deleteCV);

module.exports = router;