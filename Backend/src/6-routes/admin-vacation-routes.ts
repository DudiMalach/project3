import express, { NextFunction, Request, Response } from "express";
import imageHandler from "../2-utils/image-handler";
import verifyAdmin from "../3-middleware/verify-admin";
import VacationModel from "../4-models/vacation-model";
import adminVacationsService from "../5-services/admin-vacations-service";

const router = express.Router();

// http://localhost:4000/api/admin/users
router.get("/admin/users", async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await adminVacationsService.getAllUsers();
      response.status(200).json(user);
    }
    catch (err: any) {
      next(err);
    };
  });


// GET http://localhost:4000/api/admin/vacations
router.get("/admin/vacations", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacations = await adminVacationsService.getAllVacationsForAdmin();
        response.json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});


router.get("/admin/vacations/:id([0-9]+)",verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id
        const vacations = await adminVacationsService.getVacationById(id);
        response.json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:4000/api/admin/vacations/images/:imageName
router.get("/admin/vacations/images/:imageName",verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = imageHandler.getAbsolutePath(imageName)
        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:4000/api/admin/vacations
router.post("/admin/addvacations",verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const addedVacation = await adminVacationsService.addVacation(vacation);
        response.status(201).json(addedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:4000/api/admin/vacations/:id([0-9]+)
router.put("/admin/updatevacations/:vacationId([0-9]+)",verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.vacationId = +request.params.vacationId;
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const updateVacation = await adminVacationsService.updateVacation(vacation);
        response.json(updateVacation);
    }
    catch (err: any) {
        next(err);
    }
});

// DELETE http://localhost:4000/api/admin/deletevacations/:id([0-9]+)
router.delete("/admin/deletevacations/:id([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        await adminVacationsService.deleteVacation(id);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// http://localhost:4000/api/admin/followVacation
router.post("/admin/followVacation", async (request: Request, response: Response, next: NextFunction) => {
    try {
      const sendInfo = await adminVacationsService.followVacation(request.body);
      response.status(201).json(sendInfo);
    }
    catch (err: any) {
      next(err)
    }
  });



export default router;