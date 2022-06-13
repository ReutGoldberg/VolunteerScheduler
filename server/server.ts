import express, {Express, Request, Response} from "express";
import {getEvent, getAllEvents, getAllUsers,addNewUser,updateUser,deleteUserById, addNewAdmin} from "./db";
const config = require('./config')

const app: Express = express();
var cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}))

app.use(express.json());

const myPort = config.server_app.port;
app.listen(myPort, ()=>{
    console.log(`server running on port ${myPort}`);
});

app.get('/', (req:Request, res:Response) => {
    res.send("You're on Root with TS enabled !");
    res.status(200);
});

//Retrevie data from DB section:
app.get('/users', async (req:Request, res:Response) => {
    const users = await getAllUsers();
    res.json(users);
});

app.get('/all_events', async (req:Request, res:Response) => {
    const events = await getAllEvents();
    res.json(events);
    console.log(events)
});

app.get('/event_details/:event_id', async (req:Request, res:Response) => {
    //console.log(req)
    console.log(req.params.event_id)
    const id = Number(req.params.event_id)
    const event_details = await getEvent(id);
    // res.json(events);
    console.log("event details from db:")
    console.log(event_details)
    try{
        const full_event_details={
            id: event_details["id"],
            startAt: event_details["start_time"],
            endAt: event_details["end_time"],
            title: event_details["title"],
            details: event_details["details"],
            color: 'blue',
            allDay: false,
            label: event_details["label"],
            location: event_details["location"],
            created_by: event_details["created_by"],
            min_volenteers: event_details["min_volenteering"],
            max_volenteers: event_details["max_volenteering"],
        }
        console.log("event details after parsing:")
        console.log(full_event_details)
        res.json(full_event_details);
    }
    catch (error) {
        console.log(error)
    }
});
//Pushes data to the DB based on the request body
app.post('/users', async (req:Request, res:Response) => {
    const {firstName, lastName} = req.body;
    const user = await addNewUser(firstName,lastName);
    res.json(user);
});


app.post('/add_user', async (req:Request, res:Response) => {
    console.log('got post')
    console.log(req.body)
  //  console.log(req)
    const {name, password} = req.body;
    console.log(name)
    console.log(password)
    const user = await addNewAdmin(name, password);
    res.json(user);
});
//Updates existing records based on request body
app.put('/users', async (req:Request, res:Response) => {
    const {userId, userName} = req.body;
    const updatedUser = await updateUser(userId,userName);
    res.json(updatedUser);
});

//delete specific user
app.delete('/users:id', async (req:Request, res:Response) => {
    const userId = req.params.id;
    const deletedUser = await deleteUserById(Number(userId));    
    res.json(deletedUser);
});






// app.get('/test', (req, res) => {    
//     res.send('starting test query');
//     //put some code that fetches data from the DB (test table)
//     // and presents it to the screen as JSON objecct

// });