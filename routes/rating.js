import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import checkUserInRating from '../middleware/checkUserInRating.js'
import ratingController from '../controllers/ratingController.js'
const router = new express.Router()
router.post('/create/',authMiddleware, ratingController.create)
router.get('/getAll/:id', ratingController.getAll)
export default router