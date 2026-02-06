// User Authentication APIs
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const cloudinary = require("../config/cloudinary");

//Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//register or SignUP API
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//Login or SignIn API
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("All fields are rquired");
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid Crenditail");
    }
    res
      .status(200)
      .json({ id: user._id, user, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get User Info API
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw new Error("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, profilePicture, removeImage } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // ✅ update name
    if (name) {
      user.name = name;
    }

    // ✅ remove image
    if (removeImage === true) {
      user.profilePicture = null;
    }

    // ✅ upload new image
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
        public_id: `user_${userId}`,
        overwrite: true,
        invalidate: true,
      });

      user.profilePicture = uploadResponse.secure_url;
    }

    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



