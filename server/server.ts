import express, {Express, Request, Response} from "express";
import jwt_decode from "jwt-decode";
import { isVerifiedUser } from "./server_utils";
import {editEvent, getUserByToken,getAllLabels,getEvent, getAllEvents, getAllUsers, deleteEventById, addNewEvent, enrollToEvent, getPersonalEvents, unenrollToEvent, getIsUserEnrolledToEvent} from "./db";


const config = require('./config')

const app: Express = express();
var cors = require('cors');
app.use(cors({origin: config.client_app.localhost})) 

app.use(express.json());

const myPort = config.server_app.port;

/* Connecting the server with its sub routes*/

const addFakeRouter = require('./routes/add_fake');
app.use("/add_fake",addFakeRouter);


const userRouter = require('./routes/users');
app.use("/users",userRouter);

const eventsRouter = require('./routes/events');
app.use("/events",eventsRouter);

const labelsRouter = require('./routes/labels');
app.use("/labels",labelsRouter);

/*END*/

app.listen(myPort, ()=>{
    console.log(`server running on port ${myPort}`);
});

app.get('/', (req:Request, res:Response) => {
    res.send("You're on Root with TS enabled !");
    res.status(200);
});




