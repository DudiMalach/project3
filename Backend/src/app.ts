import express from "express";
import expressFileUpload from "express-fileupload";
import cors from "cors";
import appConfig from "./2-utils/appConfig";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import authRoutes from "./6-routes/auth-routes";
import userVacationRoutes from "./6-routes/user-vacation-routes";
import AdminVacationRoutes from "./6-routes/admin-vacation-routes";
import socket from "./2-utils/socket";

const server = express();

server.use(cors());
server.use(express.json());
server.use(expressFileUpload());
server.use("/api", authRoutes);
server.use("/api", userVacationRoutes);
server.use("/api", AdminVacationRoutes);
server.use("*",routeNotFound);
server.use(catchAll);

const httpServer = server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));

socket.initSocketIo(httpServer);