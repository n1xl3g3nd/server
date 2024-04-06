import express from 'express'
import newsController from '../controllers/newsController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import checkAuthorMiddleware from '../middleware/checkAuthorMiddleware.js'
const router = new express.Router()

router.get('/getall',newsController.getAll )
router.get('/getone/:id', newsController.getOne)
router.post('/create',authMiddleware, newsController.create,)
router.put('/update/:id',authMiddleware,checkAuthorMiddleware, newsController.update)
router.delete('/delete/:id',authMiddleware,checkAuthorMiddleware, newsController.delete)

export default router