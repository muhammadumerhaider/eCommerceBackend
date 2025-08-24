import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.json("Kindly fill out the fields.");
  }

  User.findOne({ email: email })
    .then(async (exist) => {
      if (exist) {
        return res.json("Email already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ email, password: hashedPassword, role });

      if (user) {
        return res.json({
          message: "Registration Successful.",
          _id: user._id,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        return res.json("Registration Failed.");
      }
    })
    .catch((err) => {
      return res.json(err);
    });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json("Kindly fill out the fields.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.json("User not Found.");
  } else {
    const matchPassword = await bcrypt.compare(password, user.password);
    if (user && matchPassword) {
      return res.json({
        message: "Login Successful.",
        _id: user._id,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
      });
    } else {
      return res.json("Password didn't Matched.");
    }
  }
};
