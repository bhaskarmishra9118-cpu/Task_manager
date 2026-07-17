const user_model = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isHtmlRequest = (req) => req.headers.accept && req.headers.accept.includes("text/html");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      const message = "All fields are required";
      if (isHtmlRequest(req)) {
        return res.redirect(`/register?message=${encodeURIComponent(message)}`);
      }
      return res.status(400).json({
        success: false,
        message,
      });
    }

    // Check existing user
    const existingUser = await user_model.findOne({ email });

    if (existingUser) {
      const message = "Email already exists. Please login.";
      if (isHtmlRequest(req)) {
        return res.redirect(`/register?message=${encodeURIComponent(message)}`);
      }
      return res.status(409).json({
        success: false,
        message,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await user_model.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    if (isHtmlRequest(req)) {
      return res.redirect(`/dashboard?message=${encodeURIComponent("User registered successfully")}`);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    if (isHtmlRequest(req)) {
      return res.redirect(`/register?message=${encodeURIComponent("Internal Server Error")}`);
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const message = "All fields are required";
      if (isHtmlRequest(req)) {
        return res.redirect(`/login?message=${encodeURIComponent(message)}`);
      }
      return res.status(400).json({
        success: false,
        message,
      });
    }

    // Find user
    const user = await user_model.findOne({ email });

    if (!user) {
      const message = "User not found. Please register first.";
      if (isHtmlRequest(req)) {
        return res.redirect(`/login?message=${encodeURIComponent(message)}`);
      }
      return res.status(404).json({
        success: false,
        message,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const message = "Invalid credentials";
      if (isHtmlRequest(req)) {
        return res.redirect(`/login?message=${encodeURIComponent(message)}`);
      }
      return res.status(401).json({
        success: false,
        message,
      });
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    if (isHtmlRequest(req)) {
      return res.redirect(`/dashboard?message=${encodeURIComponent("Login Successful")}`);
    }

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    if (isHtmlRequest(req)) {
      return res.redirect(`/login?message=${encodeURIComponent("Internal Server Error")}`);
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};