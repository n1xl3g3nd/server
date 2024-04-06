import { UserNewsRating, User, News } from '../models/models.js'

class ratingController  {
  async create(req, res) {
    try {
      
      const { userId, newsId, } = req.body;
  
      const user = await User.findOne({ where: { id: userId } });
      const news = await News.findOne({ where: { id: newsId } });
  
      if (!user || !news) {
        return res.status(404).json({ message: 'User or news not found' });
      }
  
      
      const candidate = await UserNewsRating.findOne({ where: { userId, newsId } });
      if (candidate) {
       await UserNewsRating.destroy({ where: { userId, newsId } });
       const rating = await UserNewsRating.findAll({ where: { newsId:newsId } });
        return res.status(200).json(rating);
        
      }
      const rating = await UserNewsRating.create({ 
          
          userId: userId,
          newsId: newsId,
          rate: true
        
      });
      const ratingFinnaly = await UserNewsRating.findAll({where:{newsId:newsId}})
      res.status(201).json(ratingFinnaly);
    } catch (e) {
      console.error(e);
      res.status(500).json(e.message);
    }
  }
  async getAll(req, res) {
    try{
      const {id} = req.params
      const rating = await UserNewsRating.findAll({where:{newsId:id}})
      return res.json(rating)
    }catch(e){
    }
  }
  
 
}

export default new ratingController()