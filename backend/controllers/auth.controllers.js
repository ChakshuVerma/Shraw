import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { sendMail, generateUserVerificationEmail } from "../utils/sendMail.js";

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!foundUser.isVerified) {
      const { subject, htmlBody, token_mail_verification } =
        generateUserVerificationEmail(foundUser._id, foundUser.name);
      const result = await sendMail(email, subject, htmlBody);
      await User.findByIdAndUpdate(foundUser._id, {
        verificationString: token_mail_verification,
      });

      if (result) {
        console.log("Email sent successfully");
      } else {
        console.log("Error while sending email");
      }

      res.status(201).json({
        message:
          "Verify your email to login. A verification email has been sent",
      });
    } else {
      generateTokenAndSetCookie(foundUser._id, res);
      res.status(201).json({
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      });
    }
  } catch (err) {
    console.log("Login controller error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signupUserController = async (req, res) => {
  try {
    const { email, password, name, confirmPassword, username } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const profilePic = "https://avatar.iran.liara.run/public";

    let newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
      profilePic,
      isVerified: false,
      verificationString: "",
    });

    if (newUser) {
      await newUser.save();

      const obj = generateUserVerificationEmail(newUser._id, name);
      const { subject, htmlBody, token_mail_verification } = obj;

      const result = await sendMail(email, subject, htmlBody);

      await User.findByIdAndUpdate(newUser._id, {
        verificationString: token_mail_verification,
      });

      if (result) {
        res.status(201).json({
          message:
            "User Created succesfully. Check your email for verification",
        });
      } else {
        res.status(201).json({
          error: "Internal server error",
        });
      }
    } else {
      res.status(400).json({ error: "Error while creating new user" });
    }
  } catch (err) {
    console.log("Signup controller error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUserController = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Logout controller error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markUserVerifiedController = async (req, res) => {
  try {
    const { providedVerificationString, userId } = req.body;
    let foundUser = await User.findById(userId);

    if (!foundUser) {
      res.status(404).json({ error: "User not found!" });
    } else if (foundUser.isVerified) {
      res.status(200).json({ message: "The user is already verified" });
    } else {
      const verificationString = foundUser.verificationString;
      if (verificationString !== providedVerificationString) {
        res.status(500).json({ error: "Link is invalid!" });
      } else {
        foundUser.verificationString = "";
        foundUser.isVerified = true;
        await User.findByIdAndUpdate(userId, foundUser);
        res.status(200).json({ message: "User verified succesfully" });
      }
    }
  } catch (err) {
    console.log("Error while marking user verified", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
