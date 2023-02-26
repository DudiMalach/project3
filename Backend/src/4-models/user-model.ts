
import { ValidationError } from "./client-errors";
import RoleModel from "./role-model";
import Joi from "Joi";

class UserModel {

    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role: RoleModel;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
    }
// PUT it is for add 
    private static putValidationSchema = Joi.object({
        userId: Joi.number().optional().integer().positive(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(20),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(1000),
        
    }) 

 // POST it is for update    
    private static postValidationSchema = Joi.object({
        userId: Joi.number().forbidden(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(20),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(1000),
        
    }) 

    public validatePutUser(): void {
        const result = UserModel.putValidationSchema.validate(this);
        if(result.error) throw new ValidationError(result.error.message);
    }


    public validatePostUser(): void {
        const result = UserModel.postValidationSchema.validate(this);
        if(result.error) throw new ValidationError(result.error.message);
    }




}

export default UserModel;