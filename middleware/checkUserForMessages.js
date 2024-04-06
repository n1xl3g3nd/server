const checkUserForMessages = async (req, res, next) => {
    try{
        const { userId } = req.params;
        const { secondUserId } = req.params;
        if(userId.toString() === req.user.id.toString() || secondUserId.toString() === req.user.id.toString()) {
            
            return next();

        }else{
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        
    
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    
  };
  export default checkUserForMessages