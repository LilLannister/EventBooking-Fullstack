import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth"; //exported function used for creating jwt token

//function to post requests for login
export async function POST(request){
    try{
        const body =await request.json();// reads request body for user email and password
        const { email,password } =body;// user email and password are extracted from request body

        // check email and password are not empty
        if(!email || !password){
            return Response.json({message:"Email and password are required!"},
                {status:400}
            );
        }

        // finding user in database by its email
        const user =await prisma.user.findUnique({
            where:{email},
        });

        //check if user exists
        if(!user){
            return Response.json({message:"Invalid credentials!"},
                {status:401}
            );
        }

        // isMatch is created for comparing entered password with hashed password in db
        const isMatch =await bcrypt.compare(password,user.passwordHash);

        // if password is not matched with stored passwprd
        if(!isMatch){
            return Response.json({message:"Invalid credentials!"},
                {status:401}
            );
        }
        // create JWT token using user information
        const token =signToken({id:user.id, email: user.email, role: user.role,});

        // return success response
        return Response.json(
            {
                message:"Login successful",
                token,// token will be used in requests for authentication
                user:{id:user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt,},
            }, // do not return hashed password
            {status: 200}
        );
    } catch (error) {
        return Response.json(
            { success:false , message: "Server error" },
            { status: 500 }
        ); // catch block ChatGPT
    }
}