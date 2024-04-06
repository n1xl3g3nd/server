import {Type} from "../models/models.js"
import ApiError from "../error/ApiError.js"
class typeController {
    async getALL(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }
    async getOne(req, res,next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const type = await Type.findByPk(req.params.id)
            if (!type) {
                throw new Error('Товар не найден в БД')
            }
            res.json(type)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async create(req, res) {
        try{
            const {name} = req.body
            const type = await Type.create({name})
            return res.json(type) 
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
        
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id категории')
            }
            const type = await Type.findByPk(req.params.id)
            if (!type) {
                throw new Error('Категория не найдена в БД')
            }
            const name = req.body.name ?? type.name
            await type.update({name})
            res.json(type)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id категории')
            }
            const type = await Type.findByPk(req.params.id)
            if (!type) {
                throw new Error('Категория не найдена в БД')
            }
            await type.destroy()
            res.json(type)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

export default new typeController()