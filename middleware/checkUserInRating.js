import { News, UserNewsRating } from '../models/models.js';

const checkUserInRating = async (req, res, next) => {
    try {
      // Получить id новости из параметров запроса
      const { id } = req.params;
      
      // Проверить, есть ли такая новость в базе данных
      const rating = await UserNewsRating.findOne({ where: { newsId: id, userId: req.user.id } });
      if (!rating) {
        return res.status(404).json({ message: 'Новость не найдена' });
      }
  
      // Проверить, является ли пользователь создателем новости
      if (rating.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Вы не являетесь человеком, поставившим оценку либо администратором' });
      }
  
      // Если проверки успешны, передать управление следующему middleware или контроллеру
      next();
    } catch (error) {
      // Обработать ошибку, если что-то пошло не так
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  };
  
  export default checkUserInRating;