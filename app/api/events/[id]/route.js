import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth' // exported function used for verifying jwt token

//handling get requests for events
export async function GET(request, {params}){
    try{
        const {id} = await params //extracting event id from params

        //fetching event details from database
        const event =await prisma.event.findUnique({
            where: {id}, //finding event by id
            include:{
                organiser: {select:{ id:true,name:true,email:true }},
                category: {select:{id:true,name:true }},
                _count: {select:{bookings:{where:{status:'CONFIRMED' }
                        }
                    }
                }
            }
        })

        //if event is not found
        if(!event){
            return Response.json(
                { success:false,message:'Event not found!'},
                {status:404}
            )
        }

        //returning event details successfully
        return Response.json(
            {success:true,event},
            {status:200}
        )
    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}

//handling put requests for updating events
export async function PUT(request, {params}){
    try{
        const payload = verifyToken(request) //verifying jwt token

        //if there is no valid token, user is unauthorized
        if(!payload){
            return Response.json(
                {success:false, message:'Unauthorized'},
                {status:401}
            )
        }

        //if user is not an organiser they are not allowed to update events
        if(payload.role !== 'ORGANISER'){
            return Response.json(
                {success:false,message:'Only organisers can update events'},
                {status:403}
            )
        }

        const { id } =await params //extracting event id from url

        //fetching event details from database
        const event =await prisma.event.findUnique({where: {id}})

        //if event is not found
        if(!event){
            return Response.json(
                {success:false,message:'Event not found'},
                {status:404}
            )
        }

        //if user is not the organiser of the event they are not allowed to update it
        if(event.organiserId !== payload.id){
            return Response.json(
                {success:false,message:'You can only update your own events'},
                {status:403}
            )
        }

        //extracting data from request body
        const { title,description,eventDate,capacity,categoryId } =await request.json()

        //checking if at least one field is provided
        if (title === undefined && description === undefined && eventDate === undefined && capacity === undefined && categoryId === undefined){
            return Response.json(
                {success:false,message:'Validation failed',errors:['At least one field must be provided']},
                {status:400}
            )
        }

        //object created for storing valid fields to update
        const updateData = {}

        //updating only provided fields 100-198
        if(title !== undefined){//checking if title is provided
            if (!title.trim()){//checking if empty string
                return Response.json({success:false, message:'Validation failed', errors:['Title cannot be empty']},
                    {status:400}
                )
            }
            updateData.title = title //updating title field
        }

        if(description !== undefined){//checking if description is provided
            if(!description.trim()){//checking if empty string
                return Response.json({success:false, message:'Validation failed', errors:['Description cannot be empty']},
                    {status:400}
                )
            }
            updateData.description = description //updating description field
        }

        if(eventDate !== undefined){//checking if eventDate is provided
            //converting input to date object to check if it is valid
            const parsedDate =new Date(eventDate)

            if(isNaN(parsedDate.getTime())){//
                return Response.json({success: false, message: 'Validation failed', errors: ['Event date is invalid']},
                    {status:400}
                )
            }

            if(parsedDate <= new Date()){//checking if date is in the past
                return Response.json(
                    {success:false, message:'Validation failed', errors:['Event date must be in the future']},
                    {status:400}
                )
            }
            updateData.eventDate = parsedDate //updating eventDate field
        }

        if(capacity !== undefined){
            //converting capacity to number
            const parsedCapacity =Number(capacity)

            if(Number.isNaN(parsedCapacity)){
                return Response.json({success:false, message:'Validation failed', errors:['Capacity must be a number']},
                    {status:400}
                )
            }

            //checking if capacity is greater than 0
            if(parsedCapacity <= 0){
                return Response.json({success:false, message:'Validation failed', errors:['Capacity must be greater than 0']},
                    {status:400}
                )
            }
            updateData.capacity = parsedCapacity //updating capacity field
        }

        if(categoryId !== undefined){ // checking if categoryId is provided
            //fetching category by id
            const category =await prisma.category.findUnique({where: { id:categoryId}})

            //if category is not found
            if (!category) {
                return Response.json({ success:false, message:'Category not found'},
                    {status:404}
                )
            }
            updateData.categoryId = categoryId //updating categoryId field
        }

        //only valid fields are updated in the database
        const updated =await prisma.event.update({
            where:{id},
            data:updateData,
            include:{organiser:{ select:{ id:true, name:true, email:true}},
                category: {select: { id: true, name: true }},
                _count: {select: {bookings: {where: {status:'CONFIRMED'}
                        }
                    }
                }
            }
        })

        return Response.json( //returning updated event details
            {success:true,event:updated },
            {status:200}
        )
    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}


//handling delete requests for deleting events
export async function DELETE(request, {params}){
    try{
        const payload =verifyToken(request) //verifying jwt token

        //if there is no valid token, user is unauthorized
        if(!payload){
            return Response.json({ success:false, message:'Unauthorized'},
                {status:401}
            )
        }

        //if user is not an organiser they are not allowed to delete events
        if(payload.role !== 'ORGANISER'){
            return Response.json(
                { success:false, message:'Only organisers can delete events'},
                {status:403}
            )
        }

        const {id} =await params //extracting event id from url

        const event =await prisma.event.findUnique({where:{id}}) //finding event by id

        if(!event){//if event is not found
            return Response.json({ success:false, message:'Event not found'},
                {status:404}
            )
        }

        //if user is not the organiser of the event they are not allowed to delete it
        if(event.organiserId !== payload.id){
            return Response.json({ success:false, message:'You can only delete your own events'},
                { status: 403 }
            )
        }

        await prisma.event.delete({where:{id}}) //deleting selecting event if all conditions are met

        return Response.json( //returning success message
            { success:true, message:'Event deleted'},
            {status:200}
        )
    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}