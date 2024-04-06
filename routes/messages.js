//routes/messages.js
import express from 'express';
import messagesController from '../controllers/messagesController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkUserForMessages from '../middleware/checkUserForMessages.js';

const router = new express.Router();

// Добавим параметр io в роутер, чтобы передавать его в контроллер

    router.get('/getall/:dialogId/:userId/:secondUserId', authMiddleware, checkUserForMessages, messagesController.getAll);
    router.get('/getone/:messageId/', checkUserForMessages, messagesController.getOne);
    router.post('/create/:userId/:secondUserId', authMiddleware, checkUserForMessages, (req, res, next) => messagesController.create(req, res, next,));
    router.put('/update/:messageId/:userId/:secondUserId', authMiddleware, checkUserForMessages, (req, res, next) => messagesController.update(req, res, next, ));
    router.delete('/delete/:messageId', authMiddleware, messagesController.delete);

  
export default router