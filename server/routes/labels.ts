import express, {Request, Response} from "express";
import { addNewLabel, getAllLabels } from "../db";
import { isVerifiedUser } from "../server_utils";
const config = require('../config')
const router = express.Router();

router.post('/add_label', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        else{
            const result_event = await addNewLabel(req.body);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.log("Error in Post add_label to Labels.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401):res.status(500);  
    }
});

router.get('/all_labels', async (req:Request, res:Response) => {
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error(config.notVerifiedUserMsg );
        }
        const labels = await getAllLabels();
        res.json(labels);
    }
    catch(err:any){
        console.log("Error in get all_labels from labels.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg ? res.status(401):res.status(500);  
    }
});

module.exports = router;