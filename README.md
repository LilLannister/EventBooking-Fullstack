# SNG346 - Semester Project - Event Booking and Ticketing System Backend

## Students
- 2587293 - Umut Efe Çelik  
- 2587285 - Uğur Ege Çelik  
- 2640662 - Onur Pınarbaşı  

## Description
This project is a RESTful backend system developed for managing events and bookings.  
It supports two types of users: organisers and attendees.  

Organisers can create, update, and delete events, while attendees can browse events and make bookings.  
The system also ensures proper validation, authorization, and prevention of overbooking.  

## Features
- register and login  
- browse available events  
- book events *attendees
- cancel their bookings  
- manage events *organisers only 
- view event dashboard *organisers only  

## Technologies Used
- Next.js 
- Prisma ORM  
- SQLite  
- JWT 
- bcryptjs 

## Setup Instructions
1. Install dependencies  
npm install  

2. Create .env file  
DATABASE_URL="file:./prisma/dev.db"  
JWT_SECRET="your_secret_key"  

3. Run database migrations  
npx prisma migrate dev  

4. Seed the database  
node prisma/seed.js  

5. Start the server  
npm run dev  

Server will run at  
http://localhost:3000  

## Main Endpoints

### Auth
- POST /api/auth/register  
- POST /api/auth/login  
- GET /api/auth/me  

### Events
- GET /api/events  
- GET /api/events/[id]  
- POST /api/events  
- PUT /api/events/[id]  
- DELETE /api/events/[id]  

### Bookings
- POST /api/events/[id]/bookings  
- GET /api/bookings/me  
- DELETE /api/bookings/[id]  

### Categories
- GET /api/categories  
- POST /api/categories  

### Dashboard
- GET /api/organiser/events/[id]/dashboard  

## Authorization Rules
- Only organisers can create, update, and delete events  
- Users can only access their own data  
- Attendees can only book events  
- Organisers can only manage their own events  

## Business Rules
- Overbooking is prevented  
- Past events cannot be booked  
- Duplicate bookings are not allowed  
- Cancelled bookings do not count towards capacity  

## HTTP Status Codes
- 200 OK  
- 201 Created  
- 400 Bad Request  
- 401 Unauthorized  
- 403 Forbidden  
- 404 Not Found  
- 409 Conflict  
- 500 Internal Server Error  