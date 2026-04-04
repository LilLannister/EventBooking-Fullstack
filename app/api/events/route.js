import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth' // exported function used for verifying jwt token

//handling get requests for events
export async function GET(){
    try{
        //fetching all events from database
        const events =await prisma.event.findMany({
            include:{
                organiser:{select:{ id: true,name: true,email: true }}, //includes organiser details
                category:{select:{ id: true,name: true }},//includes category details
                _count:{select:{ bookings:{ where:{ status:'CONFIRMED' }}}}//counts only confirmed bookings
            }, orderBy: { eventDate: 'asc' }//sorting events by date. ascending order
        })
        //return event list successfully
        return Response.json({success:true,events},{status:200})
    } catch(error){//handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}

//handling post requests for creating events
export async function POST(request) {
    try{
        const payload =verifyToken(request)

        // if there is no valid token, user is unauthorized
        if(!payload){
            return Response.json({success: false, message: 'Unauthorized!'},
                {status: 401}
            )
        }

        // if user is not an organiser, they are not allowed to create events
        if (payload.role !== 'ORGANISER') {
            return Response.json({success:false,message:'Only organisers can create events!'},
                { status:403}
            )
        }

        //extarcting data from request body
        const { title,description,eventDate,capacity,categoryId } =await request.json()

        //chacking if all fields are present
        if(!title || !description || !eventDate || capacity === undefined || capacity === null || !categoryId){
            return Response.json({success:false, message:'Validation failed', errors:['All fields are required']},
                {status:400}
            )
        }

        // Converts input date to JavaScript Date object
        const parsedDate = new Date(eventDate)
        if (isNaN(parsedDate.getTime())) { //checks if date is valid
            return Response.json(
                { success:false, message:'Validation failed', errors:['Event date is invalid'] },
                { status: 400}
            )
        }

        if (parsedDate <= new Date()) { //checks if date is in the future
            return Response.json(
                { success: false, message: 'Validation failed', errors: ['Event date must be in the future'] },
                { status: 400 }
            )
        }//55-69 ChatGPT


        const parsedCapacity = Number(capacity) //converting capacity to number
        if(Number.isNaN(parsedCapacity)){//checks if capacity is a valid number
            return Response.json(
                { success:false,message:'Validation failed',errors:['Capacity must be a number!']},
                {status:400}
            )
        }

        if(parsedCapacity<=0){//checks if capacity is greater than 0
            return Response.json(
                { success:false,message:'Validation failed',errors:['Capacity must be greater than 0!']},
                {status:400}
            )
        }

        //checkin if category exists in db
        const category =await prisma.category.findUnique({where:{ id:categoryId}})

        //if category does not exist
        if(!category){
            return Response.json(
                {success:false,message:'Category not found!'},
                {status:404}
            )
        }

        //creating event
        const event = await prisma.event.create({
            //data to be inserted into database
            data: {title, description, eventDate:parsedDate, capacity:parsedCapacity, organiserId:payload.id, categoryId},
            //includes category details
            include: {category: { select:{ id:true, name:true }}
            }
        })

        //returning created event successfully
        return Response.json({ success:true,event },{status:201})

    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}