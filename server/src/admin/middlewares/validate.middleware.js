import { validationResult } from "express-validator"
import sendResponse from "../../utils/sendResponse.js"

function runValidation(req,res,next) {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return sendResponse(res,400,null,null,errors.array())  
  }
  next()
}

export default runValidation