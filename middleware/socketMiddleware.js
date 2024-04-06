//socketMiddleware.js
export default function socketMiddleware(io) {
    return (req, res, next) => {
      req.io = io;
      next();
    };
  }