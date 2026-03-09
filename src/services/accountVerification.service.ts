import { User } from "../models/user.model.js";

export const sendVerificationCode = async (userId: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await User.findByIdAndUpdate(userId, {
    verification_code: code,
    verification_expires: expires,
  });

  console.log(`Sending code ${code} to user ${userId}`);
  // TODO: If email_or_phone contains '@', use Nodemailer, else use Twilio
};

export const verifyUserCode = async (userId: string, code: string) => {
  const user = await User.findById(userId).select(
    "+verification_code +verification_expires",
  );

  if (!user || user.verification_code !== code) {
    throw new Error("Invalid verification code");
  }

  if (user.verification_expires && user.verification_expires < new Date()) {
    throw new Error("Verification code has expired");
  }

  user.is_verified = true;
  user.verification_code = undefined;
  user.verification_expires = undefined;
  await user.save();

  return user;
};

export const resendVerificationCode = async (userId: string) => {
  const user = await User.findById(userId).select("+verification_expires");

  if (!user) throw new Error("User not found");

  // Don't allow a resend if the last code was sent less than 60 seconds ago
  if (user.verification_expires) {
    const lastSent = new Date(
      user.verification_expires.getTime() - 10 * 60 * 1000,
    );
    const now = new Date();
    if (now.getTime() - lastSent.getTime() < 60000) {
      throw new Error("Please wait 60 seconds before requesting a new code");
    }
  }

  return await sendVerificationCode(userId);
};
