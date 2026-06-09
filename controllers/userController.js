const User = require("../models/User");
const CV = require("../models/CV");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ---------------- REGISTER ---------------- */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- LOGIN ---------------- */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- SAVE CV ---------------- */
const saveCV = async (req, res) => {
  try {
    const { userId, skills, education, experience, projects } = req.body;

    const cv = new CV({
      userId,
      skills,
      education,
      experience,
      projects,
    });

    await cv.save();

    res.json({
      message: "CV Saved Successfully",
      cv,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET CV ---------------- */
const getCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.params.userId });

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json({
      message: "CV fetched successfully",
      cv,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE CV ---------------- */
const updateCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json({
      message: "CV updated successfully",
      cv,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE CV ---------------- */
const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete({ userId: req.params.userId });

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json({
      message: "CV deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- SKILL GAP ANALYSIS ---------------- */
const analyzeSkills = async (req, res) => {
  try {
    const { userId, requiredSkills } = req.body;

    const cv = await CV.findOne({ userId });

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    const userSkills = cv.skills;

    const missingSkills = requiredSkills.filter(
      (skill) => !userSkills.includes(skill)
    );

    res.json({
      yourSkills: userSkills,
      requiredSkills,
      missingSkills,
      suggestion:
        missingSkills.length === 0
          ? "You are fully qualified 🎉"
          : `Learn these skills: ${missingSkills.join(", ")}`,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- EXPORT ---------------- */
module.exports = {
  registerUser,
  loginUser,
  saveCV,
  getCV,
  updateCV,
  deleteCV,
  analyzeSkills,
};