import bcrypt from "bcryptjs"; // used for hash passwords before storing
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth"; // function to generate jwt token after successful authentication

export async function POST(request){
    try{
        const body = await request.json(); // reads request body
        const { name,email,password,role} =body; // filling fields with values from request body

        if(!name || !email || !password || !role){
            return Response.json({message:"All fields are required!"},
                {status:400}
            );
        }

        if(!email.includes("@")){
            return Response.json({message:"Invalid email format!"},
                {status:400}
            );
        }

        if(password.length<6){
            return Response.json({message:"Password must be at least 6 characters long!"},
                {status:400 }
            );
        }

        if(role!=="ORGANISER" && role!=="ATTENDEE") {
            return Response.json({message:"Invalid role!"},
                {status: 400}
            );
        }

        //34-41 check if email is already exists. if yes user is already registered with this email
        const existingUser = await prisma.user.findUnique({where:{email},});

        if(existingUser){
            return Response.json({ message:"Email already used!"},
                {status:409}
            );
        }

        // hash the password using bcrypt before storing it.
        // this prevents storing raw passwords and improves security.
        const hashedPassword = await bcrypt.hash(password,10);
        //ChatGPT

        // creating new user in database with filled fields
        const user =await prisma.user.create({
            data:{name, email, passwordHash: hashedPassword, role,},
        });

        // create JWT token with user information
        // create a JWT token to identify the user after login. the token is used in future requests for authentication.
        const token = signToken({id:user.id, email:user.email, role:user.role,});

        // return response with user information and token
        return Response.json(
            {
                message:"User registered successfully",
                token, //will be used for authentication in future requests
                user: {id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt,
                }, // we do not return hashed password
            },
            {status:201}
        );
    } catch(error){ //ChatGPT
        return Response.json(
            {success:false, message:"Server error"},
            {status:500}
        );
    }
}