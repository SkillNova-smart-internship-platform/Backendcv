const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Access Denied (No Token)" });
    }

    // 🔥 Remove Bearer if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    next();

  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = auth;