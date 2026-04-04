import prisma from '@/lib/prisma'

// handling get requests for categories
export async function GET() {
    try{
        //fetching all categories from database
        const categories =await prisma.category.findMany()

        //returning category list successfully
        return Response.json(
            { success:true,categories},
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

// handling post requests for creating categories
export async function POST(request) {
    try{
        //extracting name from request body
        const {name} =await request.json()
        //removing unnecessary spaces from name
        const trimmedName =name?.trim()

        //name must exist and must not be empty
        if(!trimmedName){
            return Response.json(
                {success:false, message:'Validation failed', errors:['Name is required']},
                { status:400}
            )
        }

        //checking if category already exists (name is unique for categories)
        const existing = await prisma.category.findUnique({where:{ name:trimmedName }})

        //if category already exists
        if(existing){
            return Response.json(
                { success:false, message:'Category already exists'},
                { status:409}
            )
        }

        //creating category if it does not exist
        const category =await prisma.category.create({data:{ name:trimmedName}})

        //category created successfully
        return Response.json(
            { success:true,category },
            { status:201}
        )
    } catch (error) { //handles error. catch block by ChatGPT
        console.error(error)
        return Response.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}