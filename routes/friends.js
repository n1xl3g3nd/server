import express from 'express'
import friendsController from '../controllers/friendsController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import checkForUserChangeMiddleware from '../middleware/checkForUserChangeMiddleware.js'

const router = new express.Router()

router.get('/getall/:id', friendsController.getAll)
router.get('/getAllUsersForAdd/:id', friendsController.getAllUsersForAdd)
router.get('/getone/:user_id/friend/:friend_id', friendsController.getOne)
router.post('/create/',authMiddleware,friendsController.create)
router.delete('/delete/:user_id/friend/:friend_id',authMiddleware,checkForUserChangeMiddleware,friendsController.delete)

export default router