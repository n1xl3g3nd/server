import express from 'express'
import typeController from '../controllers/typeController.js'
const router = new express.Router()

router.get('/getall', typeController.getALL)
router.get('/getone/:id', typeController.getOne)
router.post('/create', typeController.create)
router.put('/update/:id', typeController.update)
router.delete('/delete/:id', typeController.delete)

export default router