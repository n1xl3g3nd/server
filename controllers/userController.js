import ApiError from "../error/ApiError.js"
import * as bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import {User} from "../models/models.js"
import * as uuid from "uuid"
import * as path from 'path'
import * as fs from "fs"

const generateJwt = (id,email,role,name,) =>{
    return jwt.sign(
        {id,email,role,name},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
        )
}
const generateJwtWithImage = (id,email,role,name,image) =>{
    return jwt.sign(
        {id,email,role,name,image},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
        )
}

class userController {
    async registration(req, res,next) {
        try{
            const {email,password,role,name} = req.body
            
            if(req.files){
                const {image} = req.files
                let fileName = uuid.v4()+ ".jpg"
                image.mv(path.resolve('static', fileName))
                if(!email || !password || !name){
                    res.status(400).json({ message: 'данные неккоректны' })
                    return next(ApiError.badRequest('Данные неккоректны'))
                }
                const candidate = await User.findOne({where:{email}})
                if (candidate){
                    res.status(400).json({ message: 'Пользователь с таким email уже существует' })
                    return next(ApiError.badRequest('Пользователь с таким email уже существует'))
                }
                const hashPassword = await bcrypt.hash(password, 5)  
                const user = await User.create({email,role,password:hashPassword,name,image:fileName,})
                const token = generateJwtWithImage(user.id,user.email,user.role,user.name,fileName)
                return res.json({token})
            }else{
                if(!email || !password || !name){
                    res.status(400).json({ message: 'данные неккоректны' })
                    return next(ApiError.badRequest('Данные неккоректны'))
                }
                const candidate = await User.findOne({where:{email}})
                if (candidate){
                    res.status(400).json({ message: 'Пользователь с таким email уже существует' })
                    return next(ApiError.badRequest('Пользователь с таким email уже существует'))
                    
                }
                const hashPassword = await bcrypt.hash(password, 5)  
                const user = await User.create({email,role,name,password:hashPassword,})
                const token = generateJwt(user.id,user.email,user.role,user.name)
                return res.json({token})
            }
            
        }catch(e){
            res.status(400).json({ message: e.message })
            next(ApiError.badRequest(e.message))
        }
         
    }

    async login(req, res, next) {
    try {
        const { email, password,} = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Пользователь с таким email не найден' })
            throw new ApiError('Пользователь с таким email не найден', 400);
        }

        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            res.status(400).json({ message: 'неверный пароль' })
            throw new ApiError('неверный пароль', 500);
        }
        if(user.image){
            const token = generateJwtWithImage(user.id, user.email, user.role,user.name,user.image);
        res.json({ token });
        }else{
            const token = generateJwt(user.id, user.email, user.role,user.name);
            res.json({ token });
        }
        
    } catch (e) {
        next(new ApiError(e.message,));
    }
}

async check(req, res,next) {
    try{
        if(req.user.image){
        const token = generateJwtWithImage(req.user.id, req.user.email, req.user.role,req.user.name,req.user.image);
        return res.json({token})
        }else{
        const token = generateJwt(req.user.id, req.user.email, req.user.role,req.user.name);
        return res.json({token})
        }
        
    
    }catch(e){
        next(ApiError.badRequest(e.message))
    }
    
}
    async getOne(req, res) {
        res.status(200).send('Получение одного пользователя')
    }
    async getAll(req, res) {
        try {
            let {limit,page} = req.query
            page = page || 1
            limit = limit  || 10
            let offset = (page - 1) * limit
            const users = await User.findAndCountAll({limit:parseInt(limit),page,offset});
            res.json(users);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async update(req, res, next) {
        try {
            let { id } = req.params;
            let { email, password, role,name } = req.body;
            if (!id) {
                throw new Error('Не указан id пользователя');
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления');
            }
            if (req.files) {
                const userPhoto = await User.findOne({ where: { id } });
                const oldImageFilePath = path.resolve('static', userPhoto.image);
                if (fs.existsSync(oldImageFilePath)) {
                    fs.unlinkSync(oldImageFilePath);
                }
                const { image } = req.files;
                const fileName = uuid.v4() + '.jpg';
                image.mv(path.resolve('static', fileName));
                if (role && !['USER', 'ADMIN'].includes(role)) {
                    throw new Error('Недопустимое значение роли');
                }
                if (password) {
                    password = await bcrypt.hash(password, 5);
                }
                await User.update({ email, password, role,name, image: fileName }, { where: { id } });
                const newUser = await User.findByPk(id);
                const token = generateJwtWithImage(newUser.id, newUser.email, newUser.role,newUser.name,newUser.image);
                return res.json({ token });
            } else {
                if (role && !['USER', 'ADMIN'].includes(role)) {
                    throw new Error('Недопустимое значение роли');
                }
                if (password) {
                    password = await bcrypt.hash(password, 5);
                }
                await User.update({ email, password,name, role }, { where: { id } });
                const newUser = await User.findByPk(id);
                const token = generateJwt(newUser.id, newUser.email, newUser.role,newUser.name);
                return res.json({ token });
            }
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        let { id } = req.params;
        let { email, password, role } = req.body;
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const userPhoto = await User.findOne({ where: { id } });
                const oldImageFilePath = path.resolve('static', userPhoto.image);
                if (fs.existsSync(oldImageFilePath)) {
                    fs.unlinkSync(oldImageFilePath);
                }
            const user = await User.destroy({where: {id: req.params.id}})
            res.json(user)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

export default new userController()