import express, {Request, Response} from "express";
import { getAllEvents, getPersonalEvents, getEvent, addNewEvent, enrollToEvent, unenrollToEvent, editEvent, deleteEventById, getIsUserEnrolledToEvent, getUserByToken, getFilterEvents } from "../db";
import { isVerifiedUser } from "../server_utils";
import jwt_decode from "jwt-decode";

const config = require('../config')
const router = express.Router();

router.get('/all_events', async (req:Request, res:Response) => {
    const token = req.headers.authorization ? req.headers.authorization : "";
    console.log("get all events")
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const events = await getAllEvents();
        res.json(events);
    }
    catch(err:any){
        console.log("Error in get all_events from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);        
    }
});

router.get('/personal_events', async (req:Request, res:Response) => {
    console.log("get personal event before ")
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const decoded_token:any = jwt_decode(token);
        const token_sub = decoded_token.sub;
        const events = await getPersonalEvents(token_sub);
        res.json(events);
    }
    catch(err:any){
        console.log("Error in get personal_events from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);        
    }
});

function isEnrolled(token_sub:string, event:any){
    for(let volunteer of event["EventVolunteerMap"]){
        if(volunteer["Users"]["token"] == token_sub) {
            return true;
        }
    }
    return false;
}

function filterOnlyAvailableEvents(token_sub:string, events:any){
    let filter_events = [];
    for(let event of events){
        if(event["max_volunteers"] > event["EventVolunteerMap"].length || isEnrolled(token_sub,event)){
            filter_events.push(event);
        }
    }
    return filter_events;
  }

function cleanEvents(events:any[]){
    return events.map(e => {
        delete e["EventVolunteerMap"];
        return e;
    });  
}

function maxAlgo(events:any[]){
    events.sort(function(first, second) {
                    let diff = first["end_time"].getTime() - second["end_time"].getTime();
                    if(diff == 0){
                        diff = first["start_time"].getTime() - second["start_time"].getTime();
                    }
                    return diff;
                }
            );
    let opt_events:any[] = events.length!=0 ? [events[0]] : [];
    for(let event of events){
        if(opt_events[opt_events.length-1]["end_time"].getTime() <= event["start_time"].getTime()){
                opt_events.push(event);
        }
    }
    return opt_events;       
}

router.get('/filterd_events', async (req:Request, res:Response) => {
    console.log("-----get filtered events-------")  
    if(req.query.startDate && req.query.endDate && req.query.dateForStartTime && req.query.dateForEndTime && req.query.isMax){
        let showOnlyAvailableEvents = req.query.showOnlyAvailableEvents?.toString();
        if(!showOnlyAvailableEvents) showOnlyAvailableEvents="false";
        const labelsId = req.query.labelsId?.toString();
        let labels :number[] = labelsId ? labelsId.split(',').map(x => Number(x)) : [];
        const token = req.headers.authorization ? req.headers.authorization : "";
        try{
            if(!(await isVerifiedUser(token))){
                throw new Error(config.notVerifiedUserMsg);
            }

            const events = await getFilterEvents( new Date(req.query.startDate.toString()), new Date(req.query.endDate.toString()), 
                                                new Date(req.query.dateForStartTime.toString()), new Date(req.query.dateForEndTime.toString()),
                                                labels);
            let filter_events = events;
            
            if(showOnlyAvailableEvents=="true"){
                //@ts-ignore
                filter_events = filterOnlyAvailableEvents(jwt_decode(token).sub, events);
            }
            filter_events = cleanEvents(filter_events);
            if(req.query.isMax.toString()=="true"){
                //max-algo
                console.log("its algo time!!!");
                filter_events = maxAlgo(filter_events);
            }
            res.json(filter_events);
        }
        catch(err:any){
            console.log("Error in get filterd_events from events.ts (server router)")
            console.error(err.message);
            err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);        
        }
    }
    
});

router.get('/event_details/:event_id', async (req:Request, res:Response) => {
    const eventId = Number(req.params.event_id)
    console.log(`This is the event id: ${eventId}`)//todo: remove when done testing
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const event_details = await getEvent(eventId);
        let labels=[]
        for (let label of event_details["EventLabelMap"]){
            labels.push(label["Labels"])
        }
        const webUser = jwt_decode(token);
        let volunteers=[]
        let count_volunteers = event_details["EventVolunteerMap"].length;
        //@ts-ignore
        if((await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            for (let volenteer of event_details["EventVolunteerMap"]){
                volunteers.push(volenteer["Users"])
            }
        }
        const full_event_details={
            id: event_details["id"],
            startAt: event_details["start_time"],
            endAt: event_details["end_time"],
            title: event_details["title"],
            details: event_details["details"],
            color: 'blue', //todo: not hardcode the color
            allDay: false,
            labels: labels,
            location: event_details["location"],
            created_by: event_details["created_by"],
            min_volunteers: event_details["min_volunteers"],
            max_volunteers: event_details["max_volunteers"],
            count_volunteers: count_volunteers,
            volunteers: volunteers,
        }
        res.json(full_event_details);
    }
    catch (error:any) {
        console.log("Error in get event_details from events.ts (server router)")
        console.error(error.message);
        error.message === config.notVerifiedUserMsg? res.status(401):res.status(500);    
    }
});
//Pushes data to the DB based on the request body

router.post('/enroll_to_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    const {event_id} = req.body;
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        else{
            //@ts-ignore
            const sub_token = jwt_decode(authToken).sub
            const result_event = await enrollToEvent(event_id, sub_token);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.log("Error in enroll_to_event from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);    
    }
});

router.post('/unenroll_to_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    const {event_id} = req.body;
    console.log('--------------- unenroll to Event ---------------')
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        else{
            //@ts-ignore
            const sub_token = jwt_decode(authToken).sub
            console.log(sub_token)
            const result_event = await unenrollToEvent(event_id, sub_token);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.log("Error in unenroll_to_event from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);  
    }
});

router.post('/add_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        else{
            const result_event = await addNewEvent(req.body);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.log("Error in Post add_event from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);  
    }
});

router.post('/edit_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    console.log(req.body)
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        else{
            const result_event = await editEvent(req.body);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.log("Error in Post edit_event from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);  
    }
});

router.delete('/delete_event/:event_id', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const webUser = jwt_decode(authToken);
        //@ts-ignore
        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            throw new Error(config.noAdminRightsMsg);
        }
        else{
            const deletedEvent = await deleteEventById(Number(req.params.event_id));
            res.json(deletedEvent);
        }
    }
    catch(err:any){
        console.log("Error in delete_event from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg || config.noAdminRightsMsg ? res.status(401):res.status(500);  
    }
});

router.get('/:event_id', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization  ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg );
        }
        //@ts-ignore
        const webUserSub:string = String(jwt_decode(authToken).sub);
        const userEvent = await getIsUserEnrolledToEvent(Number(req.params.event_id), webUserSub);
        res.json(userEvent);  
    }
    catch(err:any){
        console.log("Error in get event_id from events.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg ? res.status(401):res.status(500);  
    }
});

module.exports = router;