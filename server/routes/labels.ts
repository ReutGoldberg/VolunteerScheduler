import express, {Request, Response} from "express";
import { getAllLabels } from "../db";
import { isVerifiedUser } from "../server_utils";
const config = require('../config')
const router = express.Router();


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