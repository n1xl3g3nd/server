import ApiError from "../error/ApiError.js"
import { Dialog,Message,User } from "../models/models.js";
import { Op } from "sequelize";
class dialogController {
    async getAll(req, res, next) {
        try {
            const {id} = req.params
            const dialog = await Dialog.findAll(
                {where:{[Op.or]:[{currentUserId:id},{friendInDialogId:id}]},
                include:[
                    {
                        model: User,
                        as: "currentUser", // Используйте псевдоним "user" вместо "firstFriend"
                        attributes: ["id", "name", "image"],
                    },
                    {
                        model: User,
                        as: "friendInDialog", // Используйте псевдоним "user" вместо "secondFriend"
                        attributes: ["id", "name","image"],
                    },
                    {
                        model: Message,
                        as: "messages",
                        attributes: ["id", "text", "createdAt"],
                        order: [["createdAt", "DESC"]],
                        limit: 1, // Получаем только одно самое новое сообщение
                    },
                    
                ]
                });
            return res.json(dialog)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req, res, next) {
        const {currentUserId} = req.params
        
        const {friendInDialogId} = req.params
        console.log(currentUserId,friendInDialogId)
        try {
            if (!currentUserId || !friendInDialogId) {
                throw new Error('Данные неккоректны')
            }
            const dialog = await Dialog.findOne({where:{[Op.or]:[{currentUserId:currentUserId,friendInDialogId:friendInDialogId},{currentUserId:friendInDialogId,friendInDialogId:currentUserId}]},
            include:[
                {
                    model: User,
                    as: "currentUser", // Используйте псевдоним "user" вместо "firstFriend"
                    attributes: ["id", "name","image"],
                },
                {
                    model: User,
                    as: "friendInDialog", // Используйте псевдоним "user" вместо "secondFriend"
                    attributes: ["id", "name","image"],
                },
                {
                    model: Message,
                    as: "messages", // Используйте псевдоним "user" вместо "secondFriend"
                    attributes: ["id", "text","senderId","receiverId"],
                },
            ]
            })
            if(!dialog){
                return res.json({message:'Друг не найден'})
            }
            
            return res.json(dialog)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async create(req, res, next) {
        const {currentUserId,friendInDialogId} = req.body
        console.log(currentUserId,friendInDialogId)
        try {
            if (!currentUserId || !friendInDialogId) {
                throw new Error('Данные неккоректны')
            }
            const check = await Dialog.findOne({where:{[Op.or]:[{currentUserId:currentUserId,friendInDialogId:friendInDialogId},{currentUserId:friendInDialogId,friendInDialogId:currentUserId}]}})
            if(check){
                return res.json({message:'Друг уже добавлен'})
            }
            const dialog = await Dialog.create({currentUserId,friendInDialogId})
            
            return res.json(dialog)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
        
    }
   
    async delete(req, res, next) {
        const {currentUserId} = req.params
        const {friendInDialogId} = req.params
        try {
            if (!currentUserId || !friendInDialogId) {
                throw new Error('Данные неккоректны')
            }
            const friend = await Dialog.destroy({where:{[Op.or]:[{currentUserId:currentUserId,friendInDialogId:friendInDialogId},{currentUserId:friendInDialogId,friendInDialogId:currentUserId}]}})
            
            return res.json(friend)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
}
export default new dialogController()