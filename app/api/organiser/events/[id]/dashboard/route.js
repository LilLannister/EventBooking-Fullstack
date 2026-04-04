import prisma from '@/lib/prisma'
import {verifyToken} from '@/lib/auth' // exported function used for verifying jwt token

//handling get requests for organiser's dashboard'
export async function GET(request,{params}){
    try{
        const payload =verifyToken(request) //verifying jwt token

        if(!payload){ //if there is no valid token, user is unauthorized
            return Response.json(
                { success:false, message:'Unauthorized' },
                { status:401}
            )
        }

        if(payload.role !== 'ORGANISER'){ //if user is not an organiser they are not allowed to access dashboard
            return Response.json(
                { success:false, message:'Only organisers can access dashboard' },
                { status:403}
            )
        }

        const {id} = await params //extracting event id from url

        await prisma.booking.deleteMany({where: { eventId:id}})
        // first deleting all bookings related to this event .this prevents foreign key constraint error //by ChatGPT

        await prisma.event.delete({where: { id}})// after removing related bookings, delete the event itself

        if(!event){ //if event is not found
            return Response.json(
                { success:false, message:'Event not found' },
                { status:404}
            )
        }

        if(event.organiserId !== payload.id){ //if user is not the organiser of this event
            return Response.json(
                { success:false, message:'You can only view dashboard of your own events' },
                { status:403}
            )
        }

        //fetching all confirmed bookings of this event
        const bookings =await prisma.booking.findMany({
            where: { eventId:id, status:'CONFIRMED' }, include: {user: {select: { id:true, name:true, email:true }}}
        })

        //building dashboard response with event details and bookings by ChatGPT
        return Response.json(
            {
                success: true,
                dashboard: {
                    eventTitle: event.title,
                    eventDate: event.eventDate,
                    capacity: event.capacity,
                    soldTickets: bookings.length,
                    availableTickets: event.capacity - bookings.length,
                    attendees: bookings.map(b => b.user)
                }
            },
            { status: 200 }
        )
    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}