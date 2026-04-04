import jwt from "jsonwebtoken"; // lib used to create and verify JSON web tokens //ChatGPT

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; // secret key used to sign and verify tokens. //ChatGPT

// creating token after successful login or registration
export function signToken(user) {
    return jwt.sign(
        {id: user.id, email: user.email, role: user.role,},
        JWT_SECRET,// secret key used to sign the token
        { expiresIn: "7d" } // token will expire in 7 days
    );
}

// verifies the token sent in the request headers
export function verifyToken(request) {
    try{
        // reads the authorization header from the request
        const authHeader = request.headers.get("authorization");
        // if there is no authorization header, then user is not authenticated
        if(!authHeader) {return null;}

        // authorization header must follow this format:
        // "Bearer <token>"
        // if format is wrong, reject the request
        if(!authHeader.startsWith("Bearer ")) {return null;}

        // extracts the token part from:
        // "Bearer eyJhbGciOi..."
        const token = authHeader.split(" ")[1];

        // If token part is empty, return null
        if(!token) {return null;}

        // Verifies that:
        // 1. the token was signed by this server
        // 2. the token was not changed
        // 3. the token has not expired
        // If valid, jwt.verify returns the decoded payload
        const decoded = jwt.verify(token, JWT_SECRET);

        return decoded;
    } catch (error) {
        return null;
    }
} // veriftToken function Claude AI