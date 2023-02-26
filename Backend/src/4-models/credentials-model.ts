import { validate } from 'uuid';
import { ValidationError } from './client-errors';
import Joi from "joi"

class CredentialsModel {

    public email: string
    public password: string;

    public constructor(user: CredentialsModel) {

        this.email = user.email
        this.password = user.password;
    }

    // TODO: add validation
private static validateSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(10000)
})

public validateCredentials(): void{
    const result = CredentialsModel.validateSchema.validate(this);
    if(result.error) throw new ValidationError(result.error.message);
}
}

export default CredentialsModel;