# 🎬 Soundtrack Mood Explorer — Frontend

Frontend application for the Soundtrack Mood Explorer full-stack project.

This application allows users to:
- Discover movie soundtracks
- Filter by mood
- View detailed soundtrack information
- Preview tracks via Spotify
- Register & login
- Manage profile
- Update password
- Delete account
- Save favorites

Built as a production-style full-stack portfolio project.

## 🚀 Features

- 🎵 Browse soundtracks
- 🔍 Dynamic soundtrack detail pages
- ⭐ Add / remove favorites
- 🔐 JWT-based authentication
- 👤 Full user account management (CRUD)
- 🗑 Account deletion with confirmation modal
- 📧 Robust email format validation (client & server)
- 🎧 Spotify preview integration with graceful fallback
- ♿ Accessible UI (ARIA roles, focus management)
- 💅 Clean responsive design (Tailwind CSS)

## 📸 Screenshots

### Explore Page
![Explore Page](docs/screenshots/explore.png)

### Soundtrack Detail with Spotify Preview
![Detail Page](docs/screenshots/detail.png)

### Favorites Page
![Favorites Page](docs/screenshots/favorites.png)

### Login Page
![Login Page](docs/screenshots/login.png)

## 🛠 Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- JWT Authentication
- REST API communication
- Node.js 20 LTS (standardized)

## 🔗 Backend Requirement
The frontend requires the backend API to be running.

Backend repository:
👉 `soundtrack-mood-explorer-backend`

Backend must run on:
```
http://localhost:3000
```
Frontend runs on:
```
http://localhost:3001
```

## 🌍 API Configuration
The frontend communicates directly with the backend using:
```
http://localhost:3000/api
```
No frontend environment variables are required for local development.

Earlier versions used an environment variable (`NEXT_PUBLIC_API_URL`), but this was removed to simplify configuration and prevent cross-platform inconsistencies (Linux vs Windows).

## ▶️ Running the Frontend
Install dependencies:
```
npm install
```
Start development server:
```
npm run dev
```
Open:
```
http://localhost:3001
```

## 🔐 Authentication Strategy

Authentication is implemented using JWT stored in `localStorage`.

- Token is saved after login
- Protected pages (`/favorites`, `/profile`) check authentication client-side
- If not authenticated, users are redirected to `/login`
- Logout clears stored token

⚠️ For production, authentication should be migrated to secure httpOnly cookies.

## 👤 User Account Management (Full CRUD)

As of v1.3.0, the project includes complete CRUD operations for the user model:

- Create – Register
- Read – Fetch profile (`/api/user/me`)
- Update – Change password
- Delete – Delete account

Account deletion:

- Requires confirmation via reusable modal component
- Logs user out automatically
- Removes JWT from localStorage
- Cascades deletion of user favorites

## 📧 Email Validation

Email format is validated:

- Client-side (before submission)
- Server-side (API route validation)

Prevents invalid registrations such as `fran@f`.

## 🎧 Spotify Preview (v1.3.1 Improvement)

Spotify embed logic was extracted into a reusable `SpotifyPreview` component.

Features:

- Graceful fallback UI if embed fails
- Handles unstable networks (e.g., mobile hotspot)
- Prevents blank UI on third-party failure
- Maintains layout and accessibility

If Spotify preview cannot load, users are offered a direct link to open the track in Spotify.

## 🌱 Seeding the Database (Important for Testing)

To populate demo data including Spotify previews:

1. Start the backend.
2. Open browser console.
3. Run:
```
fetch("http://localhost:3000/api/seed", { method: "POST" })
  .then(res => res.json())
  .then(console.log);
```
Expected response:
```
{ "message": "Database seeded" }
```
This inserts demo soundtracks with valid Spotify track IDs.

## 📁 Project Structure
 ```
src/
 ├── app/
 │    ├── explore/
 │    ├── soundtrack/[id]/
 │    ├── favorites/
 │    ├── profile/
 │    ├── login/
 │    └── register/
 ├── components/
 │    ├── SpotifyPreview.tsx
 │    ├── ConfirmationModal.tsx
 │    └── ...
 ├── services/
 └── utils/

 ```

## 🏷 Version
Current frontend version:
```
v1.3.1
```

### v1.3.1

- Extracted reusable `SpotifyPreview` component
- Added graceful network failure fallback
- Improved third-party embed resilience
- Synchronized lockfile after Node 20 standardization

### v1.3.0

- Implemented full user CRUD (Create, Read, Update, Delete)
- Added account deletion with confirmation modal
- Added robust email format validation
- Improved authentication stability

## 🧠 Architecture Notes

This project demonstrates:

- Separate frontend and backend repositories
- REST API communication
- JWT-based authentication
- Client-side route protection
- Modular component architecture
- Resilient third-party integration
- MongoDB via backend API

Designed to reflect real-world full-stack development practices.

## 🧩 Future Improvements

- Server-side auth with httpOnly cookies
- Pagination & advanced filtering
- Deployment (Vercel + MongoDB Atlas)
- Dark/light theme toggle
- Rate limiting & security hardening
- Unit testing (Jest / React Testing Library)

## 👨‍💻 Author

Frantisek Babinsky

Junior Full-Stack Developer

Built as a professional portfolio project.
