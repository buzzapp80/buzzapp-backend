# BUZZAPP Backend: Price Radar & Social Scout

A high-performance, privacy-centric Node.js/TypeScript backend powering **BUZZAPP**. This system enables a community-driven price-control ecosystem where users—primarily students and budget-conscious individuals—discover, verify, and maintain transparent pricing for daily essentials.

---

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Language**: TypeScript (for modular, maintainable code)
- **Database**: MongoDB with Mongoose (ACID Transactions for Data Integrity)
- **Authentication**: JWT with support for Email, Phone, OAuth, and Anonymous Guest access
- **Media**: Cloudinary + Multer (Optimized for mobile GPS/Photo uploads)
- **Documentation**: Swagger (OpenAPI 3.0)

---

## System Architecture & Key Features

### 1. Dual-Entity Identity Architecture (User vs. Profile)

To fulfill the **Anonymity by Default** requirement, the system strictly decouples authentication from social presence.

- **User Layer**: Handles secure sign-in, magic links, and 2FA.
- **Profile Layer**: Manages handles, avatars, and reputation for "Hunters" and "Consumers".

### 2. Verified Crowdsourcing Engine (Nuggets & Gems)

- **Nuggets**: Low-buzz spots that auto-expire without community verification.
- **Gems**: Persistent, high-value spots validated through user upvotes and proof-of-presence.

### 3. Dynamic Hotspot Management

Powers presence-based social gatherings (parties, study groups, flash sales).

- **Auto-Decay Logic**: Resets a 30-minute timer on user presence; automatically closes hotspots after 30 minutes of inactivity.

### 4. Smart Asset Pipeline

Integrated with Cloudinary to handle photo proof for spot verification. Includes an **Automatic Purge** mechanism to delete old avatars/photos, ensuring minimal storage footprints and user privacy.

---

## Development Roadmap

Aligned with the **BUZZAPP v1.1 SRS**, the following modules are currently in the implementation pipeline:

### Phase 2: Map & Discovery (Current Focus)

<!-- - **Grok AI Persona Integration**: Implementing the voice/text channel for the "BUZZAPP" AI assistant. -->

- **Geospatial Indexing**: MongoDB-backed discovery for Nuggets, Gems, and Hotspots.

### Phase 3: Rewards & Governance

- **Bounty System**: Public board and personal requests with PR coin rewards.
- **PR Coin Integration**: Subtle ERC-20 token rewards for community contributions.
- **Zonal Moderation**: Role-based access for community-elected moderators.

### Phase 4: Privacy & Scaling

- **Anonymity Masking**: Automatic pseudonym generation and blurred location services.
- **Performance Optimization**: Tuning for <2s response times to scale up to 100K users.

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB Replica Set** (Required for Transactions - use MongoDB Atlas for easiest setup)
- **Cloudinary Account**
- **Google Cloud Console Project** (for Web Client ID)

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Social Auth
GOOGLE_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
```

### Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start production server
npm start

# Development mode (with nodemon)
npm run dev

```

---

## API Documentation

The API is fully documented using Swagger. Once the server is running, you can explore the endpoints and test them directly:

🔗 **`http://localhost:5000/api-docs`**

---

## Project Structure

```text
src/
 ├── config/         # Cloudinary, Swagger, and DB configs
 ├── controllers/    # Express route handlers (logic)
 ├── middlewares/    # Auth, Validation, and Global Error handling
 ├── models/         # Mongoose Schemas (User & Profile)
 ├── routes/         # API Route definitions
 ├── services/       # Database queries & core business logic
 ├── types/          # TypeScript interfaces/types
 └── validations/    # Yup validation schemas

```

---

## Security Practices

- **Sensitive Data Isolation**: Fields like `password_hash` and `refresh_token` are marked `select: false` at the schema level to prevent accidental exposure.
- **Input Sanitization**: All incoming data is validated via **Yup** before reaching the controller.
- **Transactional Integrity**: No partial data writes during registration; User and Profile creation is atomic.
- **CORS & Headers**: Recommended to use `helmet` and `cors` middlewares for production.

---

## License

This project is licensed under the MIT License.
