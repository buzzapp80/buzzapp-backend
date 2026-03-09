import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/auth.validation.js";
import { registerUserSchema } from "../validations/auth.validation.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  handleGoogleLogin,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
  handleResendCode,
  handleVerifyCode,
} from "../controllers/auth.controller.js";
import { accountVerificationSchema } from "../validations/accountVerification.validation.js";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         role:
 *           type: string
 *           enum: [user, hunter, moderator, admin]
 *           description: User's role/permissions level
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 *     GoogleAuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *       required:
 *         - success
 *         - accessToken
 *         - refreshToken
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     SimpleSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *       required:
 *         - success
 *         - message
 */

// PUBLIC ROUTES

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user and profile
 *     description: Creates a User record and a Profile record in a single transaction.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email_or_phone, password, handle]
 *             properties:
 *               email_or_phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               handle:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or handle taken.
 */
router.post("/register", validate(registerUserSchema), handleRegister);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login with email/phone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email_or_phone, password]
 *             properties:
 *               email_or_phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/login", validate(loginSchema), handleLogin);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     description: |
 *       Exchanges a valid refresh token for a new access token (and new refresh token).
 *
 *       The refresh token can be provided in two ways:
 *       - **Cookie** `refreshToken` (recommended for web/browser clients)
 *       - **Request body** `{ "refreshToken": "..." }` (common for mobile/apps)
 *
 *       On success:
 *       - Sets a new HttpOnly `refreshToken` cookie
 *       - Returns both the new `accessToken` and new `refreshToken` in the response body
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (only needed if not sent via cookie)
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid, expired, revoked, or missing refresh token
 *       500:
 *         description: Internal server error
 */
router.post("/refresh", handleRefresh);

/**
 * @openapi
 * /auth/google:
 *   post:
 *     tags: [Authentication]
 *     summary: Google Social Login
 *     description: Verifies Google idToken and creates/logs in User and Profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Social login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoogleAuthResponse'
 */
router.post("/google", handleGoogleLogin);

// PROTECTED ROUTES

/**
 * @openapi
 * /auth/verify:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify account with OTP code
 *     description: |
 *       Verifies the user's account using a one-time verification code (OTP).
 *
 *       - Requires a valid access token (Bearer authentication)
 *       - On successful verification:
 *         - Marks the account as verified
 *         - Issues new access & refresh tokens
 *         - Sets a new HttpOnly `refreshToken` cookie
 *         - Returns tokens and minimal user info in the response body
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 *                 description: 6-digit verification code
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account verified successfully
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID
 *                     role:
 *                       type: string
 *                       enum: [user, hunter, moderator, admin]
 *                     is_verified:
 *                       type: boolean
 *                       example: true
 *                   required:
 *                     - id
 *                     - role
 *                     - is_verified
 *       400:
 *         description: Invalid or expired verification code
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/verify",
  protect,
  validate(accountVerificationSchema),
  handleVerifyCode,
);

/**
 * @openapi
 * /auth/resend-code:
 *   post:
 *     tags: [Authentication]
 *     summary: Resend account verification code
 *     description: |
 *       Requests a new verification code to be sent to the user's registered email or phone number.
 *
 *       - Requires a valid access token (Bearer authentication)
 *       - There is a **60-second cooldown** between resend requests to prevent abuse
 *       - On success, a new code is sent and a confirmation message is returned
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       description: No request body is required
 *     responses:
 *       200:
 *         description: New verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleSuccessResponse'
 *       429:
 *         description: Too Many Requests – must wait 60 seconds before requesting another code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please wait 60 seconds before requesting a new code
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       500:
 *         description: Internal server error (e.g. failed to send email/SMS)
 */
router.post("/resend-code", protect, handleResendCode);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out the current user
 *     description: |
 *       Logs the current user out by:
 *
 *       - Revoking all refresh tokens associated with the user (server-side invalidation)
 *       - Clearing the `refreshToken` HttpOnly cookie from the client
 *
 *       After a successful logout, the current access token remains valid only until it expires
 *       (short-lived access tokens are not revoked immediately).
 *
 *       This is a protected route — requires a valid Bearer access token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       description: No request body is required
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleSuccessResponse'
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       500:
 *         description: Internal server error
 */
router.post("/logout", protect, handleLogout);
router.post("/logout", protect, handleLogout);

export { router as authRouter };
