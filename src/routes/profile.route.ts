import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../validations/profile.validation.js";
import {
  handleGetMe,
  handleUpdateProfile,
} from "../controllers/profile.controller.js";

const router = Router();

/**
 * @openapi
 * /profile/me:
 *   patch:
 *     tags: [Profile]
 *     summary: Update current user's profile
 *     description: |
 *       Partially updates the authenticated user's profile.
 *
 *       - Only fields sent in the request body will be updated
 *       - Common updatable fields include: `handle`, `avatar_url`, `bio`, `wallet_address`, `anonymity_enabled`, `preferences`, etc.
 *       - Some fields (e.g. `handle`) may have uniqueness validation
 *       - Requires authentication (Bearer token)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 description: New unique handle (will be validated for availability)
 *                 example: "augustine_k"
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 description: URL to new profile picture
 *                 example: "https://cdn.example.com/avatars/123.jpg"
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 description: Short biography / about section
 *                 example: "Building cool things in Kumasi 🚀"
 *               wallet_address:
 *                 type: string
 *                 description: Crypto wallet address (if applicable)
 *               anonymity_enabled:
 *                 type: boolean
 *                 description: Whether to allow anonymous posting/interaction
 *               preferences:
 *                 type: object
 *                 description: Custom user preferences (key-value map)
 *                 additionalProperties: true
 *                 example:
 *                   theme: "dark"
 *                   notifications: true
 *             additionalProperties: false   # or true – depending on how strict your service is
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *       400:
 *         description: Bad request – validation error (e.g. handle already taken, invalid format)
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       409:
 *         description: Conflict – e.g. chosen handle is already in use
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/me",
  protect,
  validate(updateProfileSchema),
  handleUpdateProfile,
);

/**
 * @openapi
 * /profile/me:
 *   get:
 *     tags: [Profile]
 *     summary: Get current user's profile
 *     description: |
 *       Retrieves the complete profile information of the currently authenticated user.
 *
 *       - Returns the full profile document linked to the authenticated user
 *       - Includes all fields stored in the Profile model (handle, avatar_url, bio, wallet_address, reputation, anonymity_enabled, preferences, etc.)
 *       - Protected route — requires a valid Bearer access token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *               required:
 *                 - success
 *                 - data
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       404:
 *         description: Profile not found (should be rare if user exists and is authenticated)
 *       500:
 *         description: Internal server error
 */
router.get("/me", protect, handleGetMe);

export { router as profileRouter };
