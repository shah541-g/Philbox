import jwt from "jsonwebtoken"
import sendResponse from "../../../utils/sendResponse.js";

export async function authenticate(req,res,next) {

  try {
    const header = req.header("Authorization") || "";
    const token = header.replace("Bearer ", "");
    if(!token){
      const response_body = {
        msg: "No token, authorization denied"
      }
      return res.status(401).json(response_body)
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = {
      id: decoded.id, category: decoded.category, email: decoded.email
    }
    next()
  } catch (err) {
    const response_body = {
      msg: "Token is not valid"
    }
    console.error(err)
    return res.status(401).json(response_body)
  }
  
}


export async function isSuperAdmin (req, res, next) {

  if(!req.admin){

    return sendResponse(res,401,"Not Authenticated")
  }
  if(req.admin.category !== "super-admin"){
    return sendResponse(res,403,"Access denied: Super-admin only")
  }

  next()
}
