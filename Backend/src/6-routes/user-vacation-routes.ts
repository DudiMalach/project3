import express, { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";
import imageHandler from "../2-utils/image-handler";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import SavedModel from "../4-models/savedVacation";
import { default as userVacationsService, default as vacationsService } from "../5-services/user-vacations-service";
import { Jwt } from "jsonwebtoken";



const router = express.Router();

// GET http://localhost:4000/api/users/vacations
router.get("/users/vacations", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = cyber.getUserFromToken(request);
        const vacations = await userVacationsService.getAllVacationsForUser(user);
        response.json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:4000/api/admin/vacations/images/:imageName
router.get("/users/vacations/images/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = imageHandler.getAbsolutePath(imageName)
        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err);
    }
});

router.post('/api/followVacation', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const sendInfo = await userVacationsService.followVacation(request.body);
    response.status(201).json(sendInfo);
  }
  catch (err: any) {
    next(err)
  }
});

// // DELETE http://localhost:4000/api/users/unfollow/:vacationId
// router.delete("/users/unfollow/:vacationId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
//     try {
//         const user = cyber.getUserFromToken(request);
//         const vacationId = +request.params.vacationId;
//         await vacationsService.unfollow(user.userId, vacationId);
//         response.sendStatus(204);
//     }
//     catch (err: any) {
//         next(err);
//     }
// });

// remove followed vacation
// http://localhost:4000/api/delete/:vacationId/:userId
router.delete('/api/delete/:vacationId/:userId', async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = +request.params.userId;
      const vacationId = +request.params.vacationId;
      await userVacationsService.deleteFollowedVacation(userId, vacationId);
      response.status(202).json("{msg:'done'}");
    }
    catch (err: any) {
      next(err)
    }
  });

// Follow vacation router
//http://localhost:4000/api/user/addfollow/:id
router.post("/api/addfollow/:id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacationId = +request.params.id;
      const user =cyber.getUserFromToken(request);
      const follow = new SavedModel(user.userId, vacationId);
      const followedVacation = await userVacationsService.addFollow(follow);
      response.status(201).json(followedVacation);
    }
    catch (err: any) {
      next(err);
    }
  });



// Delete follow from vacations
// http://localhost:4000/api/user/removefollow/:id
router.delete("/api/removefollow/:id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacationId = +request.params.id;
      const user = cyber.getUserFromToken(request);
      const follower = new SavedModel(user.userId, vacationId);
      await userVacationsService.removeFollow(follower);
      response.status(204).json(follower);
    }
    catch (err: any) {
      next(err);
    }
  })


  router.get('/api/getFollowedVacations', async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = cyber.getUserFromToken(request);
      const followedVacation = await userVacationsService.getAllFollowedVacations(user.userId);
      response.json(followedVacation);
    }
    catch (err: any) {
      next(err);
    }
  });



export default router;