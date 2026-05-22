# SNG346 - Semester Project - Event Booking and Ticketing System

## Students
- 2587293 - Umut Efe Çelik  
- 2587285 - Uğur Ege Çelik  
- 2640662 - Onur Pınarbaşı  

## Description
This project is a full-stack event booking and ticketing system developed with Next.js, Prisma ORM, and SQLite.

The system supports two types of users: organisers and attendees. Organisers can create, update, delete, and monitor events through an organiser dashboard. Attendees can browse events, view event details, book tickets, and cancel their bookings.

The project includes authentication, role-based authorization, booking validation, capacity control, organiser analytics, and a responsive user interface.

## Features
- Register and login
- Role-based navigation
- Browse available events
- View event details
- Book event tickets
- Cancel bookings
- Manage events as an organiser
- Create, edit, and delete events
- View organiser dashboard and analytics
- Track capacity, sold tickets, and available tickets
- Prevent duplicate bookings and overbooking
- Sold-out event handling
- Responsive UI with active navigation highlighting

## Technologies Used
- Next.js
- React
- TailwindCSS
- Prisma ORM
- SQLite
- JWT
- bcryptjs
- Git & GitHub

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your_secret_key"
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Seed the database

```bash
node prisma/seed.js
```

### 5. Start the development server

```bash
npm run dev
```

Server will run at:

```txt
http://localhost:3000
```

## Main Pages

### Public Pages
- `/`
- `/events`
- `/events/[id]`
- `/login`
- `/register`

### Attendee Pages
- `/my-bookings`

### Organiser Pages
- `/organiser/events`
- `/organiser/events/create`
- `/organiser/events/[id]/edit`
- `/organiser/events/[id]/dashboard`

## Main Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Events
- `GET /api/events`
- `GET /api/events/[id]`
- `POST /api/events`
- `PUT /api/events/[id]`
- `DELETE /api/events/[id]`

### Bookings
- `POST /api/events/[id]/bookings`
- `GET /api/bookings/me`
- `DELETE /api/bookings/[id]`

### Categories
- `GET /api/categories`
- `POST /api/categories`

### Dashboard
- `GET /api/organiser/events/[id]/dashboard`

## Authorization Rules
- Only organisers can create, update, and delete events
- Organisers can only manage their own events
- Only attendees can book events
- Users can only access their own booking data
- Organiser dashboard is protected by role and ownership checks

## Business Rules
- Overbooking is prevented
- Past events cannot be booked
- Duplicate bookings are not allowed
- Cancelled bookings do not count towards capacity
- Sold-out events cannot be booked
- Event capacity must be greater than zero
- Event dates must be valid and in the future

## HTTP Status Codes
- `200 OK`
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`

## Architecture
The application is built using Next.js App Router. Frontend pages and backend API routes exist in the same project structure.

Prisma ORM is used for database access, and SQLite is used as the development database. JWT is used for authentication, while role-based authorization is implemented to protect organiser and attendee operations.

The project follows a feature-based Git workflow using separate branches and pull requests for frontend setup, authentication UI, event pages, organiser dashboard, booking flow improvements, and UI polish.

## Demo Accounts

### Organiser

```txt
Email: frontendorganiser@test.com
Password: 123456
```

### Attendee

```txt
Email: frontendattendee@test.com
Password: 123456
```

## Future Improvements
- Toast notifications
- Search and filtering
- Pagination
- Email notifications
- Payment integration
- Deployment support
- Advanced analytics
