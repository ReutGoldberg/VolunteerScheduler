import express, {Express, Request, Response} from "express";
import jwt_decode from "jwt-decode";
import {getUserByEmail,getEvent, getAllEvents, getAllUsers,addNewUser,updateUser,deleteUserById, addNewAdmin, addNewEvent} from "./db";

const config = require('./config')

const app: Express = express();
var cors = require('cors');
app.use(cors({origin: config.client_app.localhost})) 

app.use(express.json());

const myPort = config.server_app.port;
app.listen(myPort, ()=>{
    console.log(`server running on port ${myPort}`);
});

app.get('/', (req:Request, res:Response) => {
    res.send("You're on Root with TS enabled !");
    res.status(200);
});


app.get('/all_users', async (req:Request, res:Response) => {
    const users = await getAllUsers();
    res.json(users);
});

app.get('/all_events', async (req:Request, res:Response) => {
    const events = await getAllEvents();
    res.json(events);
    console.log(events)
});

app.get('/event_details/:event_id', async (req:Request, res:Response) => {
    console.log(req.params.event_id)
    const id = Number(req.params.event_id)
    const event_details = await getEvent(id);
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
/* Todo: Is this really needed? we have add_user & add_admin instead
app.post('/users', async (req:Request, res:Response) => {
    const {firstName, lastName,email,token} = req.body;
    const user = await addNewUser(firstName,lastName);
    res.json(user);
});
*/

app.post('/add_user', async (req:Request, res:Response) => {
    console.log('--------------- Creates new USER ---------------')
    console.log(req.body)
    const {firstName, lastName, email, token} = req.body;
    //@ts-ignore
    console.log(`${firstName} \n ${lastName} \n ${email} \n ${jwt_decode(token).sub}`)
    //@ts-ignore
    const user = await addNewUser(firstName, lastName, email, jwt_decode(token).sub);
    res.json(user);
});


app.post('/add_event', async (req:Request, res:Response) => {
    console.log('--------------- Creates new Events ---------------')
    console.log(req.body)
    const result_event = await addNewEvent(req.body);
    res.json(result_event);
});

//put and not post bc it updates a specific user and doesnt create a new one
app.put('/add_admin', async (req:Request, res:Response) => {
    console.log('got put')
    console.log(req.body)
  //  console.log(req)
    const {email} = req.body;
    console.log(`Admins email from request: ${email}`)
    const user = await addNewAdmin(email);
    res.json(user);
});

//Updates existing records based on request body
app.put('/users', async (req:Request, res:Response) => {
    const {userId, userName} = req.body;
    try {
        const updatedUser = await updateUser(userId,userName);    
        res.json(updatedUser);
        res.status(200);

    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

//delete specific user
app.delete('/users:id', async (req:Request, res:Response) => {
    const userId = req.params.id;
    const deletedUser = await deleteUserById(Number(userId));    
    res.json(deletedUser);
});


//todo: put this in Utils and use here and in AddAdmin to avoid duplicated code
const isValidEmail = (email:string) =>{
    return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
  }

//Retrevie data from DB section:

app.get('/user/userEmail/:email/:token', async (req:Request, res:Response) => {
    //const userEmailF = req.query.userEmail?.toString() ?? "";
    const email = req.params.email;
    if(!isValidEmail(email)){
        res.send(`INVALID EMAIL PROVIDED: ${email}`);
        return;
    }
    //@ts-ignore
    const recivedTokenSub = jwt_decode(req.params.token).sub; //sub should remain the same
    
    const user = await getUserByEmail(email);

    //@ts-ignore
    const subFromDB = user.token;

    //authenticate user with his sub from DB
    if(recivedTokenSub !== subFromDB){
    res.send("GOT BAD TOKEN");
    res.status(400);
    throw "Invalid input";
    }
    res.json(user);
 });


 app.get('/user/isNewUser/:email/:token', async (req:Request, res:Response) => {
    //const userEmailF = req.query.userEmail?.toString() ?? "";
    const email = req.params.email;

    if(!isValidEmail(email)){
        res.send(`INVALID EMAIL PROVIDED: ${email}`);
        res.status(400);
        throw "Invalid input";
    }

    //@ts-ignore
    const recivedTokenSub = jwt_decode(req.params.token).sub; //sub should remain the same
    
    const user = await getUserByEmail(email);
    
    if (user == null){
        return res.json(false);
    }

    //@ts-ignore
     const subFromDB = user.token;

     //authenticate user with his sub from DB
     if(recivedTokenSub !== subFromDB){
        res.send("GOT BAD TOKEN");
        res.status(400);
        throw "Invalid input";
     }
     return res.json(true);
 });




