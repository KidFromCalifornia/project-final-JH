# Stockholm Coffee Club

A comprehensive fullstack application for discovering and reviewing Stockholm's specialty coffee scene. Built with React, Node.js, and MongoDB, featuring interactive maps, user authentication, and a sophisticated coffee tasting note system.

## The Problem

Stockholm has an incredible coffee culture, but finding the best specialty coffee shops can be challenging for both locals and visitors. This application solves that by providing:

- **Interactive map** of Stockholm's coffee shops with category filtering
- **Community-driven reviews** through coffee tasting notes
- **User authentication** with personal profiles and admin management
- **Mobile-first responsive design** for on-the-go coffee discovery


### Frontend

- **React 18** with lazy loading and Suspense
- **Material-UI v5** for design system and theming
- **Zustand** for global state management
- **MapLibre GL JS** for interactive maps
- **React Router** for navigation
- **SweetAlert2** for enhanced notifications

### Backend

- **Node.js** with Express framework
- **MongoDB** with Mongoose ODM
- **JWT authentication** with bcryptjs
- **Role-based access control** (admin/user)
- **RESTful API** design with proper error handling

### Key Features

- 🗺️ Interactive map with custom icons and geolocation
- ☕ Coffee tasting notes with rating system
- 👥 User authentication and profiles
- 🔍 Advanced filtering and search functionality
- 🌓 Light/dark theme support
- 📱 Mobile-responsive design
- 👑 Admin panel for content management


## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Cafe Endpoints

- `GET /api/cafes` - Get all approved cafes
- `GET /api/cafes/:id` - Get cafe by ID
- `POST /api/cafes` - Create new cafe (admin only)

### Tasting Endpoints

- `GET /api/tastings/public` - Get public tasting notes
- `GET /api/tastings` - Get user's tastings (auth required)
- `POST /api/tastings` - Create new tasting (auth required)

### Submission Endpoints

- `POST /api/cafeSubmissions` - Submit new cafe for approval
- `GET /api/cafeSubmissions` - Get submissions (admin only)

## Approach & Planning

I approached this project with a mobile-first mindset, focusing on the core user journey of discovering coffee shops in Stockholm. The architecture separates concerns cleanly:

1. **State Management**: Zustand provides a clean alternative to Context API
2. **UI/UX**: Material-UI ensures consistency and accessibility
3. **Maps**: MapLibre offers professional mapping without vendor lock-in
4. **Authentication**: JWT tokens with role-based permissions
5. **Database**: MongoDB's flexibility handles varied cafe data structures

## Future Enhancements

Given more time, I would add:

- Real-time notifications for new cafe approvals
- Push notifications for nearby coffee recommendations
- storefront
- interactive game to learn about brewing coffee 

## View it live

- **Frontend**: https://stockholmscoffeeclub.netlify.app/
- **Backend**: https://stockhomscoffeeclub.onrender.com/api
- **GitHub**: https://github.com/KidFromCalifornia/project-final-JH

