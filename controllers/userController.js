const User = require("../models/User");
const CV = require("../models/CV");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ---------------- REGISTER ---------------- */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

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

    const {
      fullName,
      email,
      phone,
      address,
      summary,
      education,
      experience,
      skills,
      projects,
      languages,
    } = req.body;

    let cv = await CV.findOne({
      userId: req.user.id,
    });

    if (cv) {
      return res.status(400).json({
        message: "CV already exists. Please update it.",
      });
    }

    cv = await CV.create({
      userId: req.user.id,
      fullName,
      email,
      phone,
      address,
      summary,
      education,
      experience,
      skills,
      projects,
      languages,
    });

    res.status(201).json({
      message: "CV Saved Successfully",
      cv,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ---------------- GET CV ---------------- */
const getCV = async (req, res) => {
  try {

    const cv = await CV.findOne({
      userId: req.user.id,
    });

    if (!cv) {
      return res.status(404).json({
        message: "CV not found",
      });
    }

    res.json({
      message: "CV fetched successfully",
      cv,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ---------------- UPDATE CV ---------------- */
const updateCV = async (req, res) => {
  try {

    const cv = await CV.findOneAndUpdate(
      {
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!cv) {
      return res.status(404).json({
        message: "CV not found",
      });
    }

    res.json({
      message: "CV updated successfully",
      cv,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ---------------- DELETE CV ---------------- */
const deleteCV = async (req, res) => {
  try {

    const cv = await CV.findOneAndDelete({
      userId: req.user.id,
    });

    if (!cv) {
      return res.status(404).json({
        message: "CV not found",
      });
    }

    res.json({
      message: "CV deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ---------------- ANALYZE SKILLS ---------------- */
const analyzeSkills = async (req, res) => {
  try {

    const { requiredSkills } = req.body;

    const cv = await CV.findOne({
      userId: req.user.id,
    });

    if (!cv) {
      return res.status(404).json({
        message: "CV not found",
      });
    }

    const missingSkills = requiredSkills.filter(
      (skill) => !cv.skills.includes(skill)
    );

    res.json({
      yourSkills: cv.skills,
      requiredSkills,
      missingSkills,
      suggestion:
        missingSkills.length === 0
          ? "You are fully qualified 🎉"
          : `Learn: ${missingSkills.join(", ")}`,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  saveCV,
  getCV,
  updateCV,
  deleteCV,
  analyzeSkills,
};