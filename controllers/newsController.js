import ApiError from "../error/ApiError.js";
import { Friend, News, User } from "../models/models.js";
import * as uuid from "uuid";
import * as path from 'path';
import * as fs from "fs";
import { Op } from "sequelize";

class NewsController {
    async create(req, res, next) {
        try {
            const { title, text, typeId, userId } = req.body;
            if (!text) {
                return next(ApiError.badRequest('Данные некорректны'));
            }

            let fileName = null;
            if (req.files && req.files.image) {
                const { image } = req.files;
                fileName = uuid.v4() + ".jpg";
                image.mv(path.resolve('static', 'news', fileName));
            }

            const news = await News.create({ title, text, typeId, userId, image: fileName });
            return res.json({ news });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            if (!id) {
                throw new Error('Не указан id новости');
            }

            const news = await News.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "image"],
                    },
                ],
            });

            if (!news) {
                throw new Error('Новость не найдена в БД');
            }

            res.json(news);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let { typeId, limit, page, friendsInFilter, userId } = req.query;
            userId = parseInt(userId);
            page = page || 1;
            limit = limit || 10;
            const offset = (page - 1) * limit;

            let news;

            if (!typeId && !friendsInFilter) {
                news = await News.findAndCountAll({
                    limit:parseInt(limit),
                    offset,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "image"],
                        },
                    ],
                });
            } else if (typeId && !friendsInFilter) {
                news = await News.findAndCountAll({
                    where: { typeId },
                    limit:parseInt(limit),
                    offset,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "image"],
                        },
                    ],
                });
            } else if (!typeId && friendsInFilter) {
                const friends = await Friend.findAll({
                    where: {
                        [Op.or]: [{ user_id: userId }, { friend_id: userId }],
                    },
                });
                const friendIds = friends.map((friend) => (friend.user_id === userId ? friend.friend_id : friend.user_id));

                news = await News.findAndCountAll({
                    where: {
                        userId: { [Op.in]: friendIds },
                    },
                    limit:parseInt(limit),
                    offset,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "image"],
                        },
                    ],
                });
            } else if (typeId && friendsInFilter) {
                const friends = await Friend.findAll({
                    where: {
                        [Op.or]: [{ user_id: userId }, { friend_id: userId }],
                    },
                    attributes: ['friend_id'],
                });
                const friendIds = friends.map((friend) => friend.friend_id);

                news = await News.findAndCountAll({
                    where: {
                        [Op.and]: [{ typeId }, { '$user.id$': { [Op.in]: friendIds } }],
                    },
                    limit,
                    offset,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "image"],
                        },
                    ],
                });
            }

            return res.json(news);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, text, typeId, userId } = req.body;

            if (!id) {
                throw new Error('Не указан id новости');
            }

            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления');
            }

            let imageFileName = null;
            if (req.files && req.files.image) {
                const newsPhoto = await News.findOne({ where: { id } });
                const oldImageFilePath = path.resolve('static', 'news', newsPhoto.image);
                if (fs.existsSync(oldImageFilePath)) {
                    fs.unlinkSync(oldImageFilePath);
                }
                const { image } = req.files;
                imageFileName = uuid.v4() + '.jpg';
                image.mv(path.resolve('static', 'news', imageFileName));
            }

            await News.update({ title, text, typeId, userId, image: imageFileName }, { where: { id } });
            const updatedNews = await News.findByPk(id);
            return res.json(updatedNews);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            if (!id) {
                throw new Error('Не указан id новости');
            }

            const newsPhoto = await News.findOne({ where: { id } });
            const oldImageFilePath = path.resolve('static', 'news', newsPhoto.image);
            if (fs.existsSync(oldImageFilePath)) {
                fs.unlinkSync(oldImageFilePath);
            }

            const news = await News.destroy({ where: { id } });
            return res.json(news);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

export default new NewsController();
