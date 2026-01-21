import {ApiResponse} from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";
/*
const healthCheck = async (req,res,next)=>{
    try{
        const user= await getUser()
        res
           .status(200)
           .json( new ApiResponse(200, {message:"Server is running"}))

    }catch(error){
        next(err)
    }
}
 */

const healthCheck=asyncHandler(async(req,res,next)=>{
    res
    .status(200)
    .json( new ApiResponse(200,{message:"server  still is running"}));
})

export { healthCheck};