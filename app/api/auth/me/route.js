import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth"; // exported function used for verifying jwt token

//handling get requests for user information
export async function GET(request) {
    try{
        // verifying the token sent in the Authorization header
        const decoded =verifyToken(request);

        // if there is no valid token, user is unauthorized
        if(!decoded){
            return Response.json({message:"Unauthorized"},
                {status:401}
            );
        }

        // extracting user id from decoded token payload
        const userId =decoded.id;

        // finding the user in the database using the id from token
        const user =await prisma.user.findUnique({
            where:{id:userId},
            select:{id: true,name: true,email: true,role: true,createdAt: true}
            //select do not return hashed password but other user information
        })

        // if token is valid but user does not exist in database
        if(!user){
            return Response.json({message:"User not found"},
                {status: 404}
            );
        }

        // returns current user information successfully
        return Response.json(
            {user:{id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt,},},
            {status:200}
        );
    } catch (error) { //handling error. catch block by ChatGPT
        return Response.json(
            { success:false, message: "Server error" },
            { status: 500 }
        );
    }
}