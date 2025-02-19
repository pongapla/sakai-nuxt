import { DataTypes } from 'sequelize';
import dbInstance from '../db_instance';


const Language = dbInstance.define('Languages', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    lang_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lang_flag: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lang_icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'IsActive'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

(async () => {
    try {
        //await dbInstance.authenticate();
        console.log('Connection DB-Language has been established successfully.');
        await Language.sync({ force: false });
    } catch (error) {
        console.error('Unable to connect to the database or create table:', error);
    } finally {
        //await dbInstance.close();
    }
})();
export default Language;
