import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;
  console.log("req.headers ", req.headers);

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) return res.json({ message: "No token, authorization denied" });
};

export const adminOnly = async (req, res, next) => {
  console.log("req.user", req.user);

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.json({ message: "Access denied: Admins only" });
  }
};
