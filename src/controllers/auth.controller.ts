import type { Request, Response, NextFunction } from "express";
import type {
  LoginBody,
  RegisterUserBody,
} from "../validations/auth.validation.js";
import {
  resendVerificationCode,
  sendVerificationCode,
  verifyUserCode,
} from "../services/accountVerification.service.js";
import {
  generateTokens,
  login,
  refreshAccessToken,
  revokeToken,
} from "../services/auth.service.js";
import { registerUser } from "../services/user.service.js";
import type { AccountVerificationBody } from "../validations/accountVerification.validation.js";
import { verifyGoogleToken } from "../services/socialAuth.service.js";
import type { SocialAuthBody } from "../validations/socialAuth.validation.js";

/**
 * Handles new user signup and returns session tokens
 */
export const handleRegister = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newUser = await registerUser(req.body);
    if (!newUser) {
      throw new Error("User registeration failed");
    }

    await sendVerificationCode(newUser._id.toString());

    const tokens = await generateTokens(
      newUser._id.toString(),
      newUser.role,
      newUser.is_verified,
    );

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: newUser._id,
        // handle: newUser.handle,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles user login
 */
export const handleLogin = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email_or_phone, password } = req.body;
    const result = await login(email_or_phone, password);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles token refresh for mobile/web sessions
 */
export const handleRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check for token in cookie (Web) or body (Mobile)
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (!token) throw new Error("Refresh token missing");

    const tokens = await refreshAccessToken(token);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(401);
    next(error);
  }
};

// Handles verification code for account management
export const handleVerifyCode = async (
  req: Request<{}, {}, AccountVerificationBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code } = req.body;
    const userId = (req as any).user.id;

    const user = await verifyUserCode(userId, code);

    const tokens = await generateTokens(user._id.toString(), user.role, true);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Account verified successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        // handle: user.handle,
        role: user.role,
        is_verified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Handles resending verification code in case of expiry
export const handleResendCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;

    await resendVerificationCode(userId);

    res.json({
      success: true,
      message: "A new verification code has been sent to your email/phone",
    });
  } catch (error: any) {
    // If it's the 60-second cooldown error, send 429 (Too Many Requests)
    if (error.message.includes("wait 60 seconds")) res.status(429);
    next(error);
  }
};

/**
 * Handles user logout
 */
export const handleLogout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;

    await revokeToken(userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const handleGoogleLogin = async (
  req: Request<{}, {}, SocialAuthBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new Error("Google ID Token is required");

    const tokens = await verifyGoogleToken(idToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.json({ success: true, ...tokens });
  } catch (error) {
    next(error);
  }
};
