# 🎬 Soundtrack Mood Explorer — Frontend

Frontend application for the Soundtrack Mood Explorer project.

This application allows users to:

* Discover movie soundtracks
* Filter by mood
* View detailed soundtrack information
* Preview tracks via Spotify
* Register & login
* Save and manage favorites

Built as a full-stack portfolio project.

---

## 🚀 Features

* 🎵 Browse soundtracks
* 🔍 Dynamic soundtrack detail pages
* ⭐ Add / remove favorites (persistent)
* 🔐 Secure authentication (httpOnly cookies)
* 🎧 Spotify preview integration (with fallback)
* ♿ Accessible UI (ARIA roles, focus management)
* 💅 Clean responsive design (Tailwind CSS)

---

## 🚀 Deployment

Frontend is hosted on Vercel.

Backend is hosted on Vercel.

Database is hosted on MongoDB Atlas.

Authentication uses secure httpOnly cookies with cross-origin support.

---

## 🌐 Live Demo

Frontend:
https://soundtrack-mood-explorer-frontend.vercel.app

Backend API:
https://soundtrack-mood-explorer-backend.vercel.app

---

## 🔐 Authentication (v1.4.0)

Authentication is now implemented using **httpOnly cookies**:

* Token is stored securely in a cookie (not accessible via JS)
* All requests use `credentials: "include"`
* Protected pages validate auth via backend (`/api/user/me`)
* Logout clears cookie server-side

👉 This replaces the previous `localStorage`-based approach and aligns with production best practices.

---

## ⭐ Favorites System

* Add soundtrack to favorites
* Remove from favorites
* Real-time UI updates
* Fully persistent via backend (MongoDB)
* Favorite status checked per soundtrack

---

## 📸 Screenshots

### Explore Page

![Explore Page](docs/screenshots/explore.png)

### Soundtrack Detail

![Detail Page](docs/screenshots/detail.png)

### Favorites Page

![Favorites Page](docs/screenshots/favorites.png)

---

## 🛠 Tech Stack

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* REST API communication

---

## 🔗 Backend Requirement

Development:

```
Backend: http://localhost:3000
```
```
Frontend: http://localhost:3001
```

Production:

```
Backend: https://soundtrack-mood-explorer-backend.vercel.app
```
```
Frontend: https://soundtrack-mood-explorer-frontend.vercel.app
```

---

## 🌍 API Configuration

Development:

```
http://localhost:3000/api
```

Production:

```
https://soundtrack-mood-explorer-backend.vercel.app/api
```

All authenticated requests include:

```
credentials: "include"
```

---

## ▶️ Running the Frontend

```bash
npm install
npm run dev
```

Open:

```
http://localhost:3001
```

---

## 🌱 Seeding the Database

```js
fetch("http://localhost:3000/api/seed", { method: "POST" })
  .then(res => res.json())
  .then(console.log);
```

---

## 📁 Project Structure

```
src/
 ├── app/
 ├── components/
 ├── services/
 └── utils/
```

---

## 🏷 Version

Current version:

```
v1.5.0
```

### v1.5.0 Highlights

* 🚀 Deployed frontend to Vercel
* ☁️ Connected backend to MongoDB Atlas
* 🔐 Production-ready httpOnly cookie authentication
* 🌍 Environment-based API configuration
* ⭐ Persistent favorites system
* 🎧 Spotify preview integration
* 🛡️ Production CORS and security improvements

---

## 🧩 Future Improvements

* Advanced soundtrack search
* Pagination and filtering
* Toast notifications instead of alerts
* User playlists
* Spotify OAuth integration
* AI-powered soundtrack recommendations
* Dark/light theme toggle

---

## 👨‍💻 Author

Frantisek Babinsky,
Junior Full-Stack Developer

Built as a professional portfolio project.
