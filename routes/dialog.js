import express from 'express'
import dialogController from '../controllers/dialogController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import checkUserInDialog from '../middleware/checkUserInDialog.js'

const router = new express.Router()

router.get('/getall/:id', dialogController.getAll)
router.get('/getone/:currentUserId/friend/:friendInDialogId', dialogController.getOne)
router.post('/create/',authMiddleware,dialogController.create)
router.delete('/delete/:currentUserId/friend/:friendInDialogId',authMiddleware,checkUserInDialog,dialogController.delete)

export default router