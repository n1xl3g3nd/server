import sequelize from '../sequelize.js'
import database from 'sequelize'

const { DataTypes } = database


const User = sequelize.define('user', {//первый в модель передается название объекта, т.е user->название
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},//тут может быть и value администратор, но об этом позже :)
    name: {type: DataTypes.STRING, allowNull: false},
    
    image: {type: DataTypes.STRING, allowNull: true},
})
const Friend = sequelize.define('Friend', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.INTEGER},
    friend_id: {type: DataTypes.INTEGER},
    
  });
const News = sequelize.define('news', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: true},
    image: {type: DataTypes.STRING, allowNull: true},
    text: {type: DataTypes.STRING, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
})
const UserNewsRating = sequelize.define('UserNewsRating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    liked: {type: DataTypes.BOOLEAN},
    
})
const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING, allowNull: false},
    dialogId: { type: DataTypes.INTEGER },
    senderId: {type: DataTypes.INTEGER},
    receiverId: {type: DataTypes.INTEGER},
    image: {type: DataTypes.STRING, allowNull: true},
    
})
const Dialog = sequelize.define('dialog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  });
const Type = sequelize.define('type',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})



User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' });
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
User.hasMany(News,{as: 'user'})
News.belongsTo(User,{as: 'user'})
Friend.belongsTo(User, { foreignKey: "user_id" ,as: "firstUser"});
Friend.belongsTo(User, { foreignKey: "friend_id",as: "SecondUser" });
User.hasMany(Friend, { foreignKey: "user_id" });
User.hasMany(Friend, { foreignKey: "friend_id" });

User.belongsToMany(News, { through: 'UserNewsRating',onDelete: 'CASCADE' });

Dialog.belongsTo(User, { as: 'currentUser', foreignKey: 'currentUserId' });
Dialog.belongsTo(User, { as: 'friendInDialog', foreignKey: 'friendInDialogId' });
User.hasMany(Dialog, { foreignKey: 'currentUserId' });
User.hasMany(Dialog, { foreignKey: 'friendInDialogId' });
Message.belongsTo(Dialog, { foreignKey: 'dialogId',as: 'messages',onDelete: 'CASCADE' });
Dialog.hasMany(Message, { foreignKey: 'dialogId' ,onDelete: 'CASCADE' });
News.belongsToMany(User, { through: 'UserNewsRating',onDelete: 'CASCADE' });

Type.hasMany(News)
News.belongsTo(Type)





export {
    User,
    News,
    UserNewsRating,
    Friend,
    Type,
    Message,
    Dialog
    
}
