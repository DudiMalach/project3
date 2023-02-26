import { OkPacket } from "mysql";
import appConfig from "../2-utils/appConfig";
import dal from "../2-utils/dal";
import socket from "../2-utils/socket";
import SavedModel from "../4-models/savedVacation";
import UserModel from "../4-models/user-model";
import VacationModel from "../4-models/vacation-model";

async function getAllVacationsForUser(user: UserModel): Promise<VacationModel[]> {

    const sql = `
        SELECT DISTINCT V.*,
        EXISTS(SELECT * FROM followers WHERE vacationId = f.vacationId AND userId = ? ) AS isFollowing,
        COUNT(F.userId) AS followersCount,
        CONCAT('${appConfig.userVacationImagesAddress}', imageName) AS imageName
        FROM vacations AS V LEFT JOIN followers AS F
        ON V.vacationId = F.vacationId
        GROUP BY vacationId
        ORDER BY startDate
    `;

    const vacations = await dal.execute(sql, user.userId);
    return vacations;

}

async function follow(userId: number, vacationId: number): Promise<void> {
    const sql = 'INSERT INTO followers VALUES(?, ?)';
    await dal.execute(sql, userId, vacationId);
}

async function unfollow(userId: number, vacationId: number): Promise<void> {
    const sql = 'DELETE FROM followers WHERE userId = ? AND vacationId = ?';
    await dal.execute(sql, userId, vacationId);
}


async function deleteFollowedVacation(userId: number, vacationId: number): Promise<void> {
    const sql = `DELETE FROM followers WHERE userId = ? and vacationId = ?`;
    await dal.execute(sql, userId, vacationId);
  }

 
// Add follow 
async function addFollow(vacationToFollow: SavedModel): Promise<SavedModel> {
    const sql = `INSERT INTO followers(userId,vacationId)
                  VALUES(${vacationToFollow.userId}, ${vacationToFollow.vacationId})`;
    const result: OkPacket = await dal.execute(sql);

  // update +1 to followers
  const sqlVacationsTable = `UPDATE Vacations 
                            SET followers = followers + 1 
                            WHERE id = ${vacationToFollow.vacationId}`;
  const info: OkPacket = await dal.execute(sqlVacationsTable);
  socket.emitAddFollow(vacationToFollow);
  return vacationToFollow;
}



// Remove follow 
async function removeFollow(follow: SavedModel): Promise<void> {
    // remove follower from followers table
    const sqlFollowerTable = `DELETE FROM followers 
        WHERE vacationId =${follow.vacationId } 
        AND userId=${follow.userId}`;
    const results: OkPacket = await dal.execute(sqlFollowerTable);
    // update -1 to followers
    const sqlVacationsTable = `UPDATE Vacation 
                                  SET followers = followers - 1 
                                  WHERE id = ${follow.vacationId }`;
    const info: OkPacket = await dal.execute(sqlVacationsTable);
    socket.emitRemoveFollow(follow);
  }


  async function followVacation(data: SavedModel): Promise<SavedModel> {
    const sql = `INSERT INTO followers(user_ID,vacation_ID)
    VALUES(${data.userId} ,${data.vacationId})`;
    const vacation = await dal.execute(sql);
    return vacation;
  }








export default {
    getAllVacationsForUser,
    follow,
    unfollow,
    deleteFollowedVacation,
    addFollow,
    removeFollow,
    followVacation,
}