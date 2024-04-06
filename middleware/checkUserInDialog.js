const checkUserInDialog = async (req, res, next) => {
    try{
        const { currentUserId } = req.params;
        const { friendInDialogId } = req.params;
        if(currentUserId.toString() === req.user.id.toString() || friendInDialogId.toString() === req.user.id.toString()) {
            
            return next();

        }else{
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        
    
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    
  };
  export default checkUserInDialog