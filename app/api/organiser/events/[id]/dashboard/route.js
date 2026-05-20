import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const payload = verifyToken(request);

    if (!payload) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (payload.role !== "ORGANISER") {
      return Response.json(
        { success: false, message: "Only organisers can access dashboard" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        bookings: {
          where: { status: "CONFIRMED" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return Response.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    if (event.organiserId !== payload.id) {
      return Response.json(
        { success: false, message: "You can only view dashboard of your own events" },
        { status: 403 }
      );
    }

    const soldTickets = event.bookings.length;

    return Response.json(
      {
        success: true,
        dashboard: {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.eventDate,
          capacity: event.capacity,
          soldTickets,
          availableTickets: event.capacity - soldTickets,
          attendees: event.bookings.map((booking) => booking.user),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}