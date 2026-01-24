## AidLink

AidLink is a web-based Share Exchange and Donation System. It provides a secure
platform for donors and recipients to list items, request help, exchange
messages, and for admins to moderate listings and manage users.

### Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: Next.js, React, Tailwind CSS
- Auth: JWT, bcrypt
- Email: Nodemailer, Mailgen

### Project Structure
- `src/` — backend API (controllers, routes, models, middleware)
- `frontend/` — Next.js frontend
- `tests/` — backend tests

### Key Features
- JWT authentication and role-based access control (admin, donor, recipient)
- Item listings with moderation workflow
- Item requests and donation offers
- Notifications and complaint workflows
- Admin reports and analytics
- Contact form to send messages to admin
- Light/Dark mode and Amharic/English toggle

---

## Getting Started

### 1) Backend Setup
```bash
npm install
npm run dev
```

Backend defaults to `http://localhost:3000` unless `PORT` is set.

### 2) Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend defaults to `http://localhost:3000`.

If your backend runs on a different port (e.g. `8000`), set:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```
in `frontend/.env.local`.

---

## Environment Variables

### Backend (`.env`)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/aidlink
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
FRONTEND_URL=http://localhost:3000
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/reset-password
CORS_ORIGIN=http://localhost:3000
ADMIN_CONTACT_EMAIL=admin@example.com
MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_PORT=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

---

## Tests
```bash
npm test
```

---

## Notes
- The hero background image is expected at `frontend/public/hero-hands.jpg`.
- Admin routes are protected and require admin role.
