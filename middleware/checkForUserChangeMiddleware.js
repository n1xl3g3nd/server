
const checkForUserChangeMiddleware = async (req, res, next) => {
    try{
        const { user_id } = req.params;
        const { friend_id } = req.params;
        if(user_id.toString() === req.user.id.toString() || friend_id.toString() === req.user.id.toString()) {
            
            return next();

        }else{
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        
    
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    
  };
  export default checkForUserChangeMiddleware