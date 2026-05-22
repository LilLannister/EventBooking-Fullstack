const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {

  await prisma.booking.deleteMany();

  await prisma.event.deleteMany({

    where: {

      title: {

        in: ['Music Festival', 'Tech Conference'],

      },

    },

  });

  console.log('Old demo events deleted');

}

main()

  .catch(console.error)

  .finally(async () => {

    await prisma.$disconnect();

  });
