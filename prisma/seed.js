//file crated by ChatGPT for final testing on POSTMAN APP


const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding started...");

    // 1. Categories
    const music = await prisma.category.create({
        data: { name: "Music" }
    });

    const tech = await prisma.category.create({
        data: { name: "Tech" }
    });

    const sports = await prisma.category.create({
        data: { name: "Sports" }
    });

    // 2. Users
    const organiser1 = await prisma.user.create({
        data: {
            name: "Organiser One",
            email: "org1@test.com",
            passwordHash: await bcrypt.hash("123456", 10),
            role: "ORGANISER"
        }
    });

    const organiser2 = await prisma.user.create({
        data: {
            name: "Organiser Two",
            email: "org2@test.com",
            passwordHash: await bcrypt.hash("123456", 10),
            role: "ORGANISER"
        }
    });

    const attendee1 = await prisma.user.create({
        data: {
            name: "Attendee One",
            email: "att1@test.com",
            passwordHash: await bcrypt.hash("123456", 10),
            role: "ATTENDEE"
        }
    });

    const attendee2 = await prisma.user.create({
        data: {
            name: "Attendee Two",
            email: "att2@test.com",
            passwordHash: await bcrypt.hash("123456", 10),
            role: "ATTENDEE"
        }
    });

    // 3. Events
    const event1 = await prisma.event.create({
        data: {
            title: "Music Festival",
            description: "Big music event",
            eventDate: new Date("2026-06-01"),
            capacity: 2,
            organiserId: organiser1.id,
            categoryId: music.id
        }
    });

    const event2 = await prisma.event.create({
        data: {
            title: "Tech Conference",
            description: "Latest tech trends",
            eventDate: new Date("2026-07-01"),
            capacity: 3,
            organiserId: organiser2.id,
            categoryId: tech.id
        }
    });

    // 4. Bookings
    await prisma.booking.create({
        data: {
            userId: attendee1.id,
            eventId: event1.id
        }
    });

    await prisma.booking.create({
        data: {
            userId: attendee2.id,
            eventId: event1.id
        }
    });

    console.log("Seeding finished.");
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });