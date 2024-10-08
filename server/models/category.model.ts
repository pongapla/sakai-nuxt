import { DataTypes } from 'sequelize';
import dbInstance from '../db_instance';

const Category = dbInstance.define('Categories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'isactive'
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
        console.log('Connection DB-Category has been established successfully.');

        await Category.sync({ force: false });
    } catch (error) {
        console.error('Unable to connect to the database or create table:', error);
    } finally {
        //await dbInstance.close();
    }
})();
export default Category;
