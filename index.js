    //index.js(сервер)
    import config from 'dotenv/config';
    import express from 'express';
    import http from 'http';
    import { Server as SocketServer } from 'socket.io';
    import sequelize from './sequelize.js';
    import * as mapping from './models/models.js';
    import cors from 'cors';
    import router from './routes/index.js';
    import fileUpload from 'express-fileupload';
    import path from 'path';


    const PORT = process.env.PORT || 5000;

    const app = express();
    const server = http.createServer(app);
    const io = new SocketServer(server, {
    cors: {
        origin: 'http://185.112.102.22:3000/',
        methods: ['GET', 'POST'],
    },
    });
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.resolve('static')));
    app.use(express.static(path.resolve('static', 'news')));
    app.use(express.static(path.resolve('static', 'messages')));
    app.use(fileUpload({}));
    app.use('/api', router);

    const onlineUsers = [];
    
    io.on('connection', (socket) => {
      console.log('Пользователь подключен ' + socket.id);
      socket.on('joinDialog', (dialogId) => {
        console.log()
          socket.join(parseInt(dialogId));
          console.log('Пользователь ' + socket.id + ' подключился к диалогу ' + parseInt(dialogId));
      });
      socket.on('createMessage', (data) => {
        
        io.to(parseInt(data.dialogId)).emit('newMessage', data);
      });
      socket.on('checkStatus', (data) => {
          socket.emit('updateOnlineStatus', onlineUsers);
      });
      socket.on('updateUserInfo', (data) => {
          const { socketId, userId } = data;
          console.log('Received updateUserInfo:', data);
  
          const existingUserIndex = onlineUsers.findIndex((user) => user.userId === userId);
  
          if (existingUserIndex !== -1) {
              onlineUsers[existingUserIndex].socketId = socketId;
          } else {
              onlineUsers.push({ socketId, userId });
          }
  
          console.log('Current content of onlineUsers:', onlineUsers);
  
          // Отправляем обновленный статус онлайна всем пользователям
          io.emit('updateOnlineStatus', onlineUsers);
      });
  
      socket.on('disconnect', async () => {
          console.log('Пользователь отключился ' + socket.id);
  
          const index = onlineUsers.findIndex((user) => user.socketId === socket.id);
  
          if (index !== -1) {
              onlineUsers.splice(index, 1);
  
              console.log('User disconnected. Updated onlineUsers:', onlineUsers);
  
              // Отправляем обновленный статус онлайна всем пользователям
              io.emit('updateOnlineStatus', onlineUsers);
          }
      });
  });
      

    const start = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            server.listen(PORT, () => console.log('Сервер запущен на порту', PORT));
        } catch (e) {
            console.log(e);
        }
    };

    start();
