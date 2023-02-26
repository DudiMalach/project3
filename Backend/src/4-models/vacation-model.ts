import { UploadedFile } from "express-fileupload";
import Joi from "joi";
import { ValidationError } from "./client-errors";

class VacationModel {

    public vacationId: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageName: string;
    public image: UploadedFile;
    public followerCount: number;
    public isFollowing: boolean;

    public constructor(vacation: VacationModel) {
        this.vacationId = vacation.vacationId;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.imageName = vacation.imageName;
        this.image = vacation.image;
        this.followerCount = vacation.followerCount;
    }
    private static postValidationSchema = Joi.object({
        vacationId: Joi.number().forbidden(),
        destination: Joi.string().required().min(4).max(50),
        description: Joi.string().required().min(10).max(1000),
        startDate: Joi.string().required().min(3).max(100),
        endDate: Joi.string().required().min(3).max(100),
        price: Joi.number().required().min(0).max(5000),
        imageName: Joi.string().forbidden(),
        image: Joi.object().required()
    })

    private static putValidationSchema = Joi.object({
        vacationId: Joi.number().optional().integer().positive(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(5).max(1000),
        startDate: Joi.string().required().min(3).max(100),
        endDate: Joi.string().required().min(3).max(100),
        price: Joi.number().required().min(0).max(5000),
        imageName: Joi.string().optional().min(38).max(50),
        image: Joi.object().optional(),
    });
    
    
    public validatePutVacation(): void {
        const result = VacationModel.putValidationSchema.validate(this);
        if(result.error) throw new ValidationError(result.error.message);
    }


    
    public validatePostVacation(): void {
        const result = VacationModel.postValidationSchema.validate(this);
        if(result.error) throw new ValidationError(result.error.message);
    }


    
}

export default VacationModel;