import jwt from 'jsonwebtoken'
import ApiError from '../error/ApiError.js'
const authMiddleware = (req,res,next)=>{
    if(req.method==="OPTIONS"){
        next()
    }
    try{
        const token = req.headers.authorization?.split(' ')[1]
        
        if(!token){
            return res.status(201).json({message:"Не авторизован"})
        }
        if(token ){
            const decoded = jwt.verify(token,process.env.SECRET_KEY)
            req.user = decoded
            next()
        }
        return
    }catch(e){
        res.status(201).json({message:e.message})
    }
}

export default authMiddleware