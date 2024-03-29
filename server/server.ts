import express, {Express, Request, Response} from "express";

import {config} from "./config";
import helmet from "helmet";
//const config = require('./config')

const app: Express = express();
app.use(helmet());
var cors = require('cors');
const allowCorsOnClient = process.env.CLIENT_API || config.client_app.localhost;
app.use(cors({origin: allowCorsOnClient})) 
app.use(express.json());

//grab the port from the heroku server (process.env.Port) if not, default back to localhost ports
//const myPort = (process.env.PORT == null || process.env.PORT == "") ? config.server_app.port : process.env.PORT;
const myPort = process.env.PORT || config.server_app.port;
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




