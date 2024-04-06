import { Op } from "sequelize";
import ApiError from "../error/ApiError.js"
import { Friend } from '../models/models.js';
import { User } from "../models/models.js";
class friendsController {
    async getAll(req, res, next) {
        try {
            const {id} = req.params
            let {limit,page,} = req.query
            page = page || 1
            limit = limit  || 10
            let offset = page*limit - limit
            console.log(id)
            const friends = await Friend.findAndCountAll({
                where: { [Op.or]: [{ user_id: id }, { friend_id: id }] },
                limit,offset,page,
                include: [
                    
                  {
                    model: User,
                    as: "firstUser", // Используйте псевдоним "user" вместо "firstFriend"
                    attributes: ["id", "name", "email", "image"],
                  },
                  {
                    model: User,
                    as: "SecondUser", // Используйте псевдоним "user" вместо "secondFriend"
                    attributes: ["id", "name", "email", "image"],
                  },
                ],
              });
              
  
          return res.json(friends);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAllUsersForAdd(req, res, next) {
        try {
            const {id} = req.params
            const friends = await Friend.findAndCountAll({
                where: { [Op.or]: [{ user_id: id }, { friend_id: id }] },
                include: [
                    
                  {
                    model: User,
                    as: "firstUser", // Используйте псевдоним "user" вместо "firstFriend"
                    attributes: ["id", "name", "email", "image"],
                  },
                  {
                    model: User,
                    as: "SecondUser", // Используйте псевдоним "user" вместо "secondFriend"
                    attributes: ["id", "name", "email", "image"],
                  },
                ],
              });
            return res.json(friends)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req, res, next) {
        const {user_id} = req.params
        const {friend_id} = req.params
        try {
            if (!user_id || !friend_id) {
                throw new Error('Данные неккоректны')
            }
            const friend = await Friend.findOne({where:{[Op.or]:[{user_id:user_id,friend_id:friend_id},{user_id:friend_id,friend_id:user_id}]}})
            if(!friend){
                return res.json({message:'Друг не найден'})
            }
            
            return res.json(friend)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async create(req, res, next) {
        const {user_id,friend_id} = req.body
        try {
            if (!user_id || !friend_id) {
                throw new Error('Данные неккоректны')
            }
            const maybeeFriend = await Friend.findOne({where:{[Op.or]:[{user_id:user_id,friend_id:friend_id},{user_id:friend_id,friend_id:user_id}]}})
            if(maybeeFriend){
                return res.json({message:'Друг уже добавлен'})
            }
            const friend = await Friend.create({user_id,friend_id})
            
            return res.json(friend)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async update(req, res, next) {
        const {user_id} = req.params
        const {friend_id} = req.params
        try {
            if (!user_id || !friend_id) {
                throw new Error('Данные неккоректны')
            }
            const friend = await Friend.update({user_id,friend_id},{where:{user_id,friend_id}})
            
            return res.json(friend)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async delete(req, res, next) {
        const {user_id} = req.params
        const {friend_id} = req.params
        try {
            if (!user_id || !friend_id) {
                throw new Error('Данные неккоректны')
            }
            const friend = await Friend.destroy({where:{[Op.or]:[{user_id:user_id,friend_id:friend_id},{user_id:friend_id,friend_id:user_id}]}})
            
            return res.json(friend)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
}
export default new friendsController()