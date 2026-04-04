import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth' // exported function used for verifying jwt token

// handling delete cancelling requests about bookings of current attandee
export async function DELETE(request, {params}) {
    try{
        const payload =verifyToken(request)//verifying jwt token

        if(!payload){ //if there is no valid token, user is unauthorized
            return Response.json(
                { success:false, message:'Unauthorized'},
                { status:401}
            )
        }

        if(payload.role !== 'ATTENDEE'){ //if user is not an attendee they are not allowed to cancel bookings
            return Response.json(
                { success:false, message:'Only attendees can cancel bookings'},
                { status:403}
            )
        }

        const {id} =await params //extracting booking id from url

        //fetching booking details from database by its id
        const booking =await prisma.booking.findUnique({where: {id}})

        //if there is no such booking with this id
        if(!booking){
            return Response.json(
                { success:false, message:'Booking not found'},
                { status:404}
            )
        }

        // only the user who booked the event can cancel it
        if(booking.userId !== payload.id){
            return Response.json(
                { success:false, message:'You can only cancel your own bookings' },
                { status:403}
            )
        }

        //if booking is already cancelled
        if(booking.status === 'CANCELLED'){
            return Response.json(
                { success:false, message:'Booking is already cancelled'},
                { status:409}
            )
        }

        //updating booking status to cancelled
        await prisma.booking.update({where: {id}, data: { status:'CANCELLED'}})

        //returning success message for cancelled booking
        return Response.json(
            { success:true, message:'Booking cancelled' },
            { status:200}
        )
    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}