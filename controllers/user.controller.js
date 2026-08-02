import Usermodel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

export async function registerUserController(req, res) {
  try {
    let user;

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide all the required fields",
        error: true,
        success: false,
      });
    }

    user = await Usermodel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = new Usermodel({
      name,
      email,
      password: hashedPassword,
      otp: verifyCode,
      otpExpires: Date.now() + 10 * 60 * 1000, // Set OTP expiration time to 10 minutes from now
    });

    await user.save();

    // Send verification email
    const verifyEmail = await sendEmailFun({
      to: email,
      subject: "Verify email from Ecommerce App",
      text: "",
      html: VerificationEmail(name, verifyCode),
    });

    // Create a JWT token for the user for email verification
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET_KEY,
    );

    return res.status(200).json({
      message:
        "User registered successfully. Please check your email for verification.",
      error: false,
      success: true,
      token, // Optional: You can include the token in the response if needed for further actions
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const isCodevalid = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();

    if (!isCodevalid && !isNotExpired) {
      user.verify_email = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      return res.status(200).json({
        message: "Email verified successfully",
        error: false,
        success: true,
      });
    } else if (!isCodevalid) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    } else {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide all the required fields",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await Usermodel.findByIdAndUpdate(user?._id, {
      last_login_date: Date.now(),
    });

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

    return res.json({
      message: "User logged in successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


//logout user
export async function logoutUserController(req, res) {
    try{
        const userid = req.userId;  //middleware

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };
        res.clearCookie("accessToken", cookieOption);
        res.clearCookie("refreshToken", cookieOption);

        const removeRefreshToken = await Usermodel.findByIdAndUpdate(userid, {
            refresh_token: "",
        });

        return res.json({
            message: "User logged out successfully",
            error: false,
            success: true,
        });

    }catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
          });
    }
}
