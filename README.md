# 🎬 Soundtrack Mood Explorer — Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Version](https://img.shields.io/badge/version-v1.8.0-blue)

Frontend application for Soundtrack Mood Explorer, a full-stack portfolio project for discovering and organizing movie soundtracks by mood.

This application allows users to:

- Discover movie soundtracks
- Filter by mood
- View detailed soundtrack information
- Preview tracks via Spotify
- Register & login securely
- Save and manage favorites
- View personal profile statistics
- Contact the developer through a built-in contact form

Built as a full-stack portfolio project.

---

## 🚀 Features

- 🎵 Browse movie soundtracks
- 🔍 Search by title, movie or composer
- 🎭 Filter by mood
- ⭐ Persistent favorites
- 👤 Profile statistics
- 📬 Contact form with email delivery
- 🔐 Secure authentication
- 🎧 Spotify preview integration
- ♿ Accessible UI
- 📱 Responsive design

---

## 🚀 Deployment

- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

Authentication uses secure httpOnly cookies with cross-origin support.

---

## 🌐 Live Demo

- **Frontend:** https://soundtrack-mood-explorer-frontend.vercel.app
- **Backend API:** https://soundtrack-mood-explorer-backend.vercel.app

---

## 🔐 Authentication (v1.4.0)

Authentication is now implemented using **httpOnly cookies**:

- Token is stored securely in a cookie (not accessible via JS)
- All requests use `credentials: "include"`
- Protected pages validate auth via backend (`/api/user/me`)
- Logout clears cookie server-side

👉 This replaces the previous `localStorage`-based approach and aligns with production best practices.

---

## 🌐 Browser Compatibility

Tested successfully on:

* Google Chrome
* Safari iOS

### Note

Safari's Intelligent Tracking Prevention (ITP) applies stricter rules to cross-site authentication cookies. Some Safari configurations may require privacy settings to be adjusted during testing.

---

## ⭐ Favorites

- Add and remove favorites
- Persistent across sessions
- Synced with MongoDB
- Real-time UI updates

---

## 📸 Screenshots

### Explore Page

![Explore Page](docs/screenshots/explore.png)

### Soundtrack Detail

![Detail Page](docs/screenshots/detail.png)

### Favorites Page

![Favorites Page](docs/screenshots/favorites.png)

### Profile Page

![Profile Page](docs/screenshots/profile.png)

### Contact Page

![Contact Page](docs/screenshots/contact.png)

---

## 🛠 Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- REST API communication
- Vercel

---

## 🌍 Environment Configuration

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
  .then((res) => res.json())
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

## 🏗 Architecture

```text
User
  │
  ▼
Next.js Frontend
  │
  ▼
REST API
  │
  ▼
Next.js Backend
  │
  ▼
MongoDB Atlas
```

---

## 🏷 Version

Current version:

```
v1.8.0
```

---

## ✨ Current Highlights

- 🔍 Search soundtracks by title, movie, or composer
- 🎭 Combined search and mood filtering
- ⭐ Persistent favorites with reusable EmptyState component
- 👤 Profile statistics dashboard
- 📬 Functional contact form with email delivery
- 📅 Member Since information
- 🎼 Favorite count and most common mood
- 🧩 Reusable StatCard component
- 🔐 Secure authentication using httpOnly cookies
- 🎧 Spotify preview integration
- ♿ Accessible, keyboard-friendly interface
- 📱 Responsive design for desktop and mobile

---

## 🧩 Future Improvements

Future improvements are tracked through GitHub Issues.

Planned enhancements include:

- 🎼 Playlist support
- 🎵 Spotify OAuth integration
- 🤖 AI-powered soundtrack recommendations
- 🎛 Advanced filtering
- 🧪 Unit and integration testing

See the Issues tab for the latest roadmap.

---

## 🗺 Roadmap

### ✅ Completed

- User authentication
- Favorites management
- Responsive navigation
- Soundtrack search
- Mood filtering
- Spotify preview integration
- Reusable EmptyState component
- Improved empty states
- Profile statistics
- Reusable StatCard component
- Contact form
- Email delivery

### 🚧 Planned

- Playlist support
- Spotify OAuth integration
- Improve Safari cross-site cookie compatibility
- Advanced filtering
- AI-powered soundtrack recommendations
- Unit & integration testing

See the GitHub Issues tab for the latest roadmap.

---

## 📋 Project Management

Development is managed using GitHub Issues and feature branches.

- Feature requests
- Bug reports
- Roadmap
- Release planning

See the **Issues** tab for current work and future improvements.

---

## 👨‍💻 Author

Frantisek Babinsky,
Full-Stack Developer

Built as a professional portfolio project.
