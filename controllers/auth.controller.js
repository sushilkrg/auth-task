import AuthModel from "../model/Auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../utils/generateToken.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(404).json({
        message: "Please provide complete field like name, email, password",
      });
    }

    // check if user already exist
    const existingUser = await AuthModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email alreasy exist." });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await AuthModel.create({
      name,
      email,
      password: hashedPassword,
    });

    generateRefreshToken(newUser._id, res);
    generateAccessToken(newUser._id, res);

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log("Error in register controller", error.message);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(404).json({
        message: "Please provide complete field like email, password",
      });
    }

    const user = await AuthModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Invalid credential" });
    }

    generateRefreshToken(user._id, res);
    const accessToken = generateAccessToken(user._id, res);

    res.status(200).json({
      message: "Login successfull",
      user: {
        _id: user?._id,
        name: user.name,
        email: user.email,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
  }
}

export async function generateAccessTokenUsingRefreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).josn({ error: "Unauthorized: token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      return res.status(401).josn({ error: "Unauthorized: invalid token" });
    }

    const user = await AuthModel.findById(decoded.userId).select("-password");

    const accessToken = generateAccessToken(user?._id, res);
    res.status(200).json({
      message: "Access token created",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(
      "Error in generateAccessTokenUsingRefreshToken controller",
      error.message,
    );
  }
}
