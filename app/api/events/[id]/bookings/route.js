import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth' // exported function used for verifying jwt token

// handling post requests about bookings
export async function POST(request, {params}) {
    try{
        const payload =verifyToken(request) //verifying jwt token

        //if there is no valid token, user is unauthorized
        if(!payload){
            return Response.json(
                { success:false, message:'Unauthorized'},
                { status:401}
            )
        }

        //if user is not an attendee they are not allowed to book events
        if(payload.role !== 'ATTENDEE'){
            return Response.json(
                { success:false, message:'Only attendees can book events' },
                { status:403 }
            )
        }

        const {id} =await params //extracting event id from url

        //fetching event details from database
        const event =await prisma.event.findUnique({
            where: {id}, include: {_count: {select: {bookings: {where: { status:'CONFIRMED' }
                        }
                    }
                }
            }
        })

        //if event is not found
        if(!event){
            return Response.json(
                { success:false, message:'Event not found' },
                { status:404}
            )
        }

        //checking if event is in the past
        if(new Date(event.eventDate) <= new Date()){
            return Response.json(
                { success:false, message:'Cannot book a past event' },
                { status:400 }
            )
        }

        //checking if event is full
        if(event._count.bookings >= event.capacity){
            return Response.json(
                { success:false, message:'Event is already full' },
                { status:409 }
            )
        }

        //checking if user has already booked this event
        const existingBooking =await prisma.booking.findUnique({
            where: {userId_eventId: {userId: payload.id, eventId:id}}, //finding existing booking by user id and event id
            include: {event: {select: { id:true, title:true, eventDate:true }}} //including event details
        })

        //if user has already booked this event
        if(existingBooking && existingBooking.status === 'CONFIRMED'){
            return Response.json(
                { success:false, message:'You already booked this event'},
                { status:409}
            )
        }

        let booking

        // If booking exists but was cancelled reactivate it instead of creating a new one
        if(existingBooking && existingBooking.status === 'CANCELLED'){
            booking =await prisma.booking.update({ //updating existing booking
                where: { id:existingBooking.id},
                data: { status:'CONFIRMED'},
                include: {event: {select: { id:true, title:true, eventDate:true}}
                }
            })
        } else { //creating new booking
            booking = await prisma.booking.create({
                data: {userId:payload.id, eventId:id, status:'CONFIRMED'},
                include: {event: {select: { id:true, title:true, eventDate:true }}
                }
            })
        }

        //returning booking details successfully
        return Response.json(
            { success:true, booking},
            { status:201 }
        )
    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}