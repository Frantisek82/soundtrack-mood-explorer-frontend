# 🎬 Soundtrack Mood Explorer — Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Version](https://img.shields.io/badge/version-v1.6.0-blue)

Frontend application for the Soundtrack Mood Explorer, a full-stack portfolio project for discovering and organizing movie soundtracks by mood.

This application allows users to:

- Discover movie soundtracks
- Filter by mood
- View detailed soundtrack information
- Preview tracks via Spotify
- Register & login
- Save and manage favorites

Built as a full-stack portfolio project.

---

## 🚀 Features

- 🎵 Browse movie soundtracks
- 🔍 Search by title, movie or composer
- 🎭 Filter by mood
- ⭐ Persistent favorites
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
* Microsoft Edge
* Firefox
* Safari (macOS/iOS)

### Note

Safari's Intelligent Tracking Prevention (ITP) applies stricter rules to cross-site authentication cookies. Some Safari configurations may require privacy settings to be adjusted during testing.

---

## ⭐ Favorites System

- Add soundtrack to favorites
- Remove from favorites
- Real-time UI updates
- Fully persistent via backend (MongoDB)
- Favorite status checked per soundtrack

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

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- REST API communication

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
v1.6.0
```

### v1.6.0 Highlights

* 🔍 Added soundtrack search (title, movie and composer)
* 🎭 Search works together with mood filtering
* 📱 Improved mobile search experience
* ♿ Improved accessibility and focus management
* ⭐ Favorites remain fully persistent
* 🔐 Secure authentication using httpOnly cookies
* 📖 Updated project documentation

---

## 📦 Release History

### v1.6.0

- 🔍 Added soundtrack search
- 🎭 Combined search with mood filtering
- 📱 Improved mobile search experience
- 📖 Updated project documentation

### v1.5.1

- 🚀 Deployed frontend to Vercel
- ⭐ Added persistent favorites
- 🎧 Integrated Spotify previews
- 📱 Implemented responsive mobile navigation
- 📋 Introduced GitHub Issues roadmap

---

## 🧩 Future Improvements

Future improvements are tracked through GitHub Issues.

Examples include:

- Playlist support
- Spotify OAuth
- AI recommendations
- Admin dashboard
- Unit & integration testing

See the Issues tab for the latest roadmap and planned features.

---

## 🗺 Roadmap

### ✅ Completed

- User authentication
- Favorites management
- Responsive navigation
- Soundtrack search
- Mood filtering
- Spotify preview integration

### 🚧 Planned

- Improved empty states
- Profile statistics
- Improve Safari authentication compatibility
- Advanced filtering
- AI-powered soundtrack recommendations

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
