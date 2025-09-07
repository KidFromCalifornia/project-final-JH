# Stockholm Coffee Club

Welcome to Stockholm Coffee Club — a fullstack app that helps you discover the city’s best specialty coffee spots. Whether you’re a local on the hunt for your next flat white or a visitor exploring Stockholm’s café culture, this app’s got you covered.

Built with **React, Node.js, and MongoDB**, it features interactive maps, user accounts, and a way to log your own coffee tasting notes.

---

## Why this app?

Stockholm has an established coffee culture, but finding the really good spots isn’t always easy. This app brings them all together in one place with:

- An interactive map of coffee shops (with filters so you can find what matters to you)
- A tasting notes system so you (and others) can review your coffee adventures
- User accounts, profiles, and admin features for managing content
- A mobile-first design so you can use it on the go

---

## Tech stack

### Frontend

- **React 18** with lazy loading + Suspense
- **Material-UI v5** for styling and theming
- **Zustand** for state management
- **MapLibre GL JS** for the interactive map
- **React Router** for navigation
- **SweetAlert2** for nicer alerts

### Backend

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT authentication** (with bcryptjs)
- **Role-based access control** (admin & user)
- **REST API** with solid error handling

---

## Main features

- Interactive map with geolocation
- Coffee tasting notes & ratings
- User authentication + profiles
- Filters & search to find the right café
- Light/dark theme toggle
- Mobile-friendly design
- Admin panel for managing cafés and submissions

---

## API Endpoints (quick peek)

**Auth**

- `POST /api/auth/register` → Create a new account
- `POST /api/auth/login` → Log in

**Cafés**

- `GET /api/cafes` → Get all approved cafés
- `GET /api/cafes/:id` → Get one café
- `POST /api/cafes` → Add new café (admin only)

**Tastings**

- `GET /api/tastings/public` → Browse public notes
- `GET /api/tastings` → Your tasting notes (login required)
- `POST /api/tastings` → Add a tasting note (login required)

**Submissions**

- `POST /api/cafeSubmissions` → Suggest a café
- `GET /api/cafeSubmissions` → View submissions (admin only)

---

## How I built it

I started with the core journey: discovering cafés on a map. From there, I layered on features like tastings, profiles, and admin tools. A few key decisions:

1. **State management**: Used Zustand (lighter than Context, simpler than Redux)
2. **UI/UX**: Material-UI made styling fast and consistent
3. **Maps**: Went with MapLibre (open-source, no vendor lock-in)
4. **Auth**: JWT-based with role handling
5. **Database**: MongoDB for flexible café + review data

---

## What’s next?

Some things I’d love to add down the line:

- Real-time notifications when new cafés get approved
- Push notifications for nearby recommendations
- A storefront for beans & gear
- A fun coffee-brewing mini-game
-

---

## Live links

- **Frontend**: [stockholmscoffeeclub.netlify.app]
  (https://stockholmscoffeeclub.netlify.app/)
- **Backend**: [stockholmscoffeeclub.onrender.com/api]
  (https://stockholmscoffeeclub.onrender.com/api)
- **GitHub**: [project-final-JH]
  (https://github.com/KidFromCalifornia/project-final-JH)
