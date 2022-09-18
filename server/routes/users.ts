import express, {Request, Response} from "express";
import { addNewUser, deleteUserById, getAllAdminUsers, getUserByEmail, updateUser,getUserByToken, setAdmin, getAllUsers } from "../db";
import { isValidEmail, isVerifiedUser } from "../server_utils";
import jwt_decode from "jwt-decode";

const config = require('../config')
const router = express.Router();


//Updates existing records based on request body
router.put('/', async (req:Request, res:Response) => {
    const {userId, userName} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const updatedUser = await updateUser(userId,userName);    
        res.json(updatedUser);
        res.status(200);

    } catch (error:any) {
        console.log("Error in updateUser from server.ts")
        console.error(error.message);        
        error.message === config.notVerifiedUserMsg? res.status(401):res.status(500);    
    }
});

router.get('/all_users', async (req:Request, res:Response) => {
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const users = await getAllUsers();
        res.json(users);   
    }
    catch(err:any){
        console.log("Error in getAllUsers from server.ts")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);    }
});

//Pushes data to the DB based on the request body

router.post('/add_user', async (req:Request, res:Response) => {
    const {firstName, lastName, email} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!isValidEmail(email)){
            throw new Error(config.invalidUserMsg);
        }       
        else{
            const decoded_token:any = jwt_decode(authToken);
            const webTokenSub = decoded_token.sub; 
            const user = await addNewUser(firstName, lastName, email, webTokenSub);
            res.json(user);
        }
    }
    catch(err:any){
        console.log("Error in POST add_user from server.ts")
        console.error(err.message);
        err.message === config.invalidUserMsg? res.status(400):res.status(500);        
    }
});


//delete specific user
//todo: consider deleting this function as it's dangerous.
router.delete('/:id', async (req:Request, res:Response) => {
    
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const webUser:any = jwt_decode(authToken);
        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            throw new Error(config.noAdminRightsMsg);
        }
        const userId = req.params.id;
        const deletedUser = await deleteUserById(Number(userId));    
        res.json(deletedUser);
    } catch (error:any) {
        console.log("Error in delete user from server.ts")
        console.error(error.message);
        error.message === config.notVerifiedUserMsg || config.noAdminRightsMsg ? res.status(401):res.status(500);        
    }
});

//Retrevie user data from DB section:
router.get('/userEmail/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        } 
        const decoded_token:any = jwt_decode(authToken);
        const user = await getUserByToken(decoded_token.sub);
        res.json(user);
    }
    catch(err:any){
        console.log("Error in get user from server.ts")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg ? res.status(401):res.status(500);        
    }
 });

 //only serves the login page for new users - doesn't suport query for all emails
 router.get('/isNewUser/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken, true))){ //checks the auth token is ok and user's email is in a valid formation
            throw new Error(config.notVerifiedUserMsg);
        }   
        const decoded_token:any = jwt_decode(authToken);
        const user = await getUserByToken(decoded_token.sub);
        if (user == null){
            return res.json(false);
        }
        return res.json(true);


    } catch (error:any) {
        console.log("Error in isNewUser from server.ts")
        console.error(error.message);
        error.message === config.notVerifiedUserMsg? res.status(401):res.status(500);   
    }
 });

 router.get('/adminsUserEmail/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){ //checks the auth token is ok and user's email is in a valid formation
            throw new Error(config.notVerifiedUserMsg);
        }
        getAllAdminUsers().then(adminUsers => res.json(adminUsers));
    } catch (error:any) {
        console.log("Error in adminsUserEmail - getting the admins list from server.ts")
        console.error(error.message);
        error.message === config.notVerifiedUserMsg? res.status(401):res.status(500); 
    }
    
 });

 //put and not post bc it updates a specific user and doesnt create a new one
router.put('/add_admin', async (req:Request, res:Response) => {
    const {email, isAdminFlag} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){            
            throw new Error(config.notVerifiedUserMsg);
        }
        const webUser:any = jwt_decode(authToken);

        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){            
            throw new Error(config.noAdminRightsMsg);
        }

        const userToUpdate = getUserByEmail(email)
        .then((dbUser) => {setAdmin(dbUser.email, isAdminFlag);});

        res.json(userToUpdate);   
        res.status(200);
    } catch (error:any) {
        console.log("Error in add_admin from server.ts")
        console.error(error.message);
        error.message === config.notVerifiedUserMsg || config.noAdminRightsMsg ? res.status(401):res.status(500); 
    }
});

 //put and not post bc it updates a specific user and doesnt create a new one
 router.put('/remove_admin', async (req:Request, res:Response) => {
    const {email, isAdminFlag} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }

        const webUser:any = jwt_decode(authToken);

        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            throw new Error(config.noAdminRightsMsg);
        }

        const userToUpdate = getUserByEmail(email)
        .then((dbUser) => {setAdmin(dbUser.email, isAdminFlag);});

        res.json(userToUpdate);   
        res.status(200);
    } catch (error:any) {
        console.log("Error in remove_admin from server.ts")
        console.error(error.message);
        error.message === config.notVerifiedUserMsg || config.noAdminRightsMsg ? res.status(401):res.status(500); 
    }
});




module.exports = router;