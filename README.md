# 🎬🎵 Soundtrack Mood Explorer
A full-stack web application that allows users to explore movie soundtracks, view detailed information, and manage a personal list of favorite soundtracks.

This repository contains the frontend application, built as a portfolio project to demonstrate modern full-stack development with authentication, REST APIs, accessibility, and clean UI/UX practices

## 🚀 Features
- 🔍 Browse and explore movie soundtracks
- 📄 View detailed soundtrack pages
- 🔐 User authentication (JWT-based)
- ⭐ Add and remove soundtracks from Favorites
- 👤 Protected user profile & favorites pages
- ♿ Accessibility-focused UI (ARIA roles, focus management)
- 🌐 REST API consumption with protected routes
- 💾 Persistent data via backend + MongoDB

## 🛠 Tech Stack
### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Fetch API for client–server communication

## 📂 Project Structure
This project is split into two independent repositories:
```bash
frontend/
 ├── src/app
 ├── src/components
 ├── src/services
 ├── src/utils
 └── ...
```
The frontend and backend communicate only via HTTP requests, making them fully decoupled and independently deployable.

## 🔐 Authentication
- Authentication is handled using JSON Web Tokens (JWT)
- Tokens are stored client-side and sent via `Authorization` headers
- Protected frontend routes:
  - Favorites
  - Profile
- Unauthorized users are redirected to the login page or shown friendly inline messages

### 🔌 API Usage Examples (Frontend)

The frontend communicates with the backend exclusively via HTTP requests using the Fetch API.
All authenticated requests include a JWT token in the `Authorization` header.

## 🔐 Login

Used in `src/services/auth.ts`
```ts
await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});
```
On success, the backend returns a JWT token which is stored client-side and reused for protected requests.

## ⭐ Add to Favorites

Used in src/services/favorites.ts
```ts
await fetch("http://localhost:3000/api/favorites", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    soundtrackId: "6978077a7e6d488aba392d46",
  }),
});
```

## ❌ Remove from Favorites
```ts
await fetch(
  `http://localhost:3000/api/favorites/${soundtrackId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```
The backend DELETE endpoint is idempotent, so repeated calls are safe.

## ⭐ Favorites System
 - Users can add or remove soundtracks from favorites
 - Favorites are stored per user in the backend database
 - Frontend handles:
   - Optimistic UI updates
   - Loading indicators
   - Graceful behavior when logged out

## 🧠 Key Technical Highlights
- Defensive frontend logic for authenticated / unauthenticated users
- Reusable UI components (Buttons, Cards, Skeletons, Spinners)
- Accessibility best practices:
  - `aria-live`, `role="alert"`, focus management
- Idempotent REST API consumption
- Clean separation of concerns between UI, services, and utilities
- Consistent UI/UX across Explore, Favorites, and Detail pages

## ⚙️ Environment Variables
### Frontend
No environment variables required for local development (API URL is local and defined in service files).

## ▶️ Running the Project Locally
### Frontend
```bash
cd frontend
npm install
npm run dev
```
 - Frontend: http://localhost:3001

 ## 🧪 Tested Use Cases
 - Register & login
 - Browse soundtracks
 - View soundtrack details
 - Add/remove favorites
 - Persistent favorites after refresh
 - Proper behavior when logged out
 - Accessible keyboard navigation and focus states

## 📌 Future Improvements
- Search & filtering
- Pagination
- User profile editing
- Deployment (Vercel + MongoDB Atlas)
- Unit and integration tests

## 👨‍💻 Author

**Frantisek Babinsky**  
Junior Full-Stack Developer  

Built as part of a professional portfolio project.
