import Branch from "../../../models/Branch.js";
import sendResponse from "../../../utils/sendResponse.js";
import { seedAddress } from "../../utils/seedAddress.js";


export const createBranch = async (req, res) => {
  try {
    const {name, address, cover_img_url} = req.body;
    
    const address_id = await seedAddress(address)
    
    const branch = new Branch({
      name, address_id
    })
    await branch.save()
    return sendResponse(res, 201, "Branch created Successfully", branch, null)
    
  } catch (err) {
    console.error(err)
    return sendResponse(res,500,"Server Error", null, err)
  }
}


export const listBranches = async (req,res) => {
  const branches = await Branch.find();
  res.json(branches)
}

// 03289479980