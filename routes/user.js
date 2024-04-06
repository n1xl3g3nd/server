import express from 'express'
import userController from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router = new express.Router()


router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth',authMiddleware, userController.check)
router.get('/getall', userController.getAll)
router.get('/getone/:id',userController.getOne)
router.put('/update/:id', userController.update)
router.delete('/delete/:id', userController.delete)

export default router