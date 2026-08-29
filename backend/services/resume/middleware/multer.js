import fs from "fs"
import multer from "multer"
const uploadPath = "./uploads"

if(!fs.existsSync(uploadPath)){
fs.mkdirSync(uploadPath)
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null , uploadPath)
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${req.headers["x-user-id"] || "user"}-${file.originalname}`
        cb(null , uniqueName)
    }
})


const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "application/pdf"){
        cb(null , true)
    }else{
        cb(new Error("Only PDF files are allowed") , false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 20 *1024 * 1024 
    }
})
