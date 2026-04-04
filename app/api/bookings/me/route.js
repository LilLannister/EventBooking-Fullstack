import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth' //function used to verify JWT token

// handling get requests for user's bookings (returning bookings of current authenticated user)
export async function GET(request) {
    try{
        const payload =verifyToken(request) // verifying jwt token from auth header

        // check if user is not authenticated
        if(!payload){
            return Response.json({ success:false, message:'Unauthorized'},
                {status:401})
        }

        // check if user is not an attendee, so they can't view bookings
        if(payload.role !== 'ATTENDEE'){
            return Response.json(
                { success:false, message:'Only attendees can view bookings'},
                {status:403}
            )
        }

        //fetching bookings of current user
        const bookings =await prisma.booking.findMany({
            where: { userId:payload.id }, include: {event: {select: {id:true, title:true, description:true, eventDate:true, capacity:true, category:true
                    }
                }
            },
            orderBy: { bookedAt:'desc'} // sorting bookings by date, descending order
        })

        //returning bookings if everything is ok
        return Response.json({ success:true,bookings})
    } catch (error) { //handles error. catch block by ChatGPT
        return Response.json({ success: false, message: error.message }, { status: 500 })
    }
}