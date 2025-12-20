import multer from "multer"

// Switch to memory storage for serverless compatibility
const storage = multer.memoryStorage() 

export const upload = multer({
    storage,
})