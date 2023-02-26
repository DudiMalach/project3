import express, { Request, Response, NextFunction } from "express"; // import express module and specific interfaces from it
import dal from "../2-utils/dal"; // import data access layer
import CredentialsModel from "../4-models/credentials-model"; // import Credentials model
import UserModel from "../4-models/user-model"; // import User model
import authService from "../5-services/auth-service"; // import auth service 

const router = express.Router(); // Create an instance of express Router

// POST http://localhost:4000/api/auth/register
// this route is to handle the registration of new user
router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Create a new UserModel instance from the request body
        const user = new UserModel(request.body); 
        // call the register method from authService and pass the user instance
        const token = await authService.register(user); 
        // return the token with status 201 (resource created)
        response.status(201).json(token); 
    }
    catch (err: any) {
        // pass the error to the next middleware function
        next(err);
    }
})

// POST http://localhost:4000/api/auth/login
// this route is to handle the login of an existing user
router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Create a new CredentialsModel instance from the request body
        const credentials = new CredentialsModel(request.body);
        // call the login method from authService and pass the credentials instance
        const token = await authService.login(credentials);
        // return the token with status 200 (OK)
        response.json(token);
    }
    catch (err: any) {
        // pass the error to the next middleware function
        next(err);
    }
})

export default router; 
