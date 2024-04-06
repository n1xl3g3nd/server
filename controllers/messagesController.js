    // messagesController.js
    import ApiError from "../error/ApiError.js";
    import { Dialog, Message, User } from "../models/models.js";
    import * as uuid from "uuid";
    import * as path from 'path';
    import * as fs from "fs";

    class MessagesController {
        constructor(io) {
            this.io = io;
        }

        async getAll(req, res, next) {
            try {
                const { dialogId } = req.params;
                const messages = await Message.findAll({ where: { dialogId: dialogId } });
                return res.json(messages);
            } catch (e) {
                next(ApiError.badRequest(e.message));
            }
        }

        async getOne(req, res, next) {
            const { messageId } = req.params;

            try {
                if (!messageId) {
                    throw new Error('Данные неккоректны');
                }
                const message = await Message.findOne({ where: { id: messageId } });

                if (!message) {
                    return res.json({ message: 'сообщение не найдено' });
                }

                return res.json(message);
            } catch (e) {
                next(ApiError.badRequest(e.message));
            }
        }

        create = async (req, res, next) => {
            try {
                const { text, dialogId } = req.body;
                const { userId, secondUserId } = req.params;

                if (req.files) {
                    const { image } = req.files;
                    const fileName = uuid.v4() + ".jpg";
                    image.mv(path.resolve('static', 'messages', fileName));
                    if (!text) {
                        return next(ApiError.badRequest('Данные неккоректны'));
                    }

                    const message = await Message.create({
                        text,
                        dialogId,
                        senderId: userId,
                        receiverId: secondUserId,
                        image: fileName
                    });

                    // Отправка сообщения через WebSocket
                    

                    res.json({ message });
                } else {
                    if (!text) {
                        return next(ApiError.badRequest('Данные неккоректны'));
                    }

                    const message = await Message.create({
                        text,
                        dialogId,
                        senderId:userId,
                        receiverId:secondUserId
                    });

                    res.json({ message });
                }

            } catch (e) {
                next(ApiError.badRequest(e.message));
            }
        }

        async update(req, res, next) {
            try {
                let { messageId } = req.params;
                let { text, dialogId, senderId, receiverId } = req.body;
                if (!messageId) {
                    throw new Error('Не указан id новости');
                }
                if (Object.keys(req.body).length === 0) {
                    throw new Error('Нет данных для обновления');
                }
                if (req.files) {
                    const messagePhoto = await Message.findOne({ where: { id: messageId } });
                    const oldImageFilePath = path.resolve('static', 'messages', messagePhoto.image);
                    if (fs.existsSync(oldImageFilePath)) {
                        fs.unlinkSync(oldImageFilePath);
                    }
                    const { image } = req.files;
                    const fileName = uuid.v4() + '.jpg';
                    image.mv(path.resolve('static', 'messages', fileName));
                    await Message.update({ text, dialogId, senderId, receiverId, image: fileName }, { where: { id: messageId } });
                } else {
                    await Message.update({ text, dialogId, senderId, receiverId }, { where: { id: messageId } });
                }
                const newNews = await Message.findByPk(messageId);

                return res.json(newNews);
            } catch (e) {
                next(ApiError.badRequest(e.message));
            }
        }

        async delete(req, res, next) {
            const { messageId } = req.params;

            try {
                if (!messageId) {
                    throw new Error('Данные неккоректны');
                }
                const mesage = await Message.destroy({ where: { id: messageId } });

                return res.json(mesage);
            } catch (e) {
                next(ApiError.badRequest(e.message));
            }
        }
    }

    export default new MessagesController();
