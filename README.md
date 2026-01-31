# 🎬🎵 Soundtrack Mood Explorer
A full-stack web application that allows users to explore movie soundtracks, view detailed information, and manage a personal list of favorite soundtracks.
Built as a portfolio project to demonstrate modern full-stack development with authentication, REST APIs, and database integration.

## 🚀 Features
 - 🔍 Browse and explore movie soundtracks
 - 📄 View detailed soundtrack pages
 - 🔐 User authentication (JWT-based)
 - ⭐ Add and remove soundtracks from Favorites
 - 👤 Protected user profile & favorites pages
 - 🌐 REST API with protected routes
 - 💾 Persistent data storage with MongoDB

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
The frontend and backend communicate only via HTTP requests, making them fully decoupled.

## 🔐 Authentication
 - Authentication is handled using JSON Web Tokens (JWT)
 - Tokens are stored client-side and sent via Authorization headers
 - Protected routes:
 - Favorites
 - Profile
 - Unauthorized users are redirected to the login page

## ⭐ Favorites System
 - Users can add or remove soundtracks from favorites
 - Favorites are stored per user in MongoDB
 - Removal uses an idempotent DELETE endpoint
 - Backend ensures data consistency using userId + soundtrackId

## 🧠 Key Technical Highlights
 - Defensive frontend logic for authenticated / unauthenticated users
 - Idempotent REST API design
 - Proper MongoDB ObjectId handling
 - Next.js App Router compatibility (async route params)
 - Clean separation of concerns between layers

## ⚙️ Environment Variables
### Frontend
No environment variables required for local development (API URL is local).

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

## 📌 Future Improvements
 - Search & filtering
 - Pagination
 - User profile editing
 - Deployment (Vercel + MongoDB Atlas)
 - Unit and integration tests

 👨‍💻 Author

[Frantisek Babinsky]
Junior Full-Stack Developer
Built as part of a professional portfolio