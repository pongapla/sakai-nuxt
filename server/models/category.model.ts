import { DataTypes } from 'sequelize';
import dbInstance from '../db_instance';
import CategoryLanguage from './category_language.model';
import Language from './language.model';

const Category = dbInstance.define('Categories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    group: {
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

Category.hasMany(CategoryLanguage, { foreignKey: 'category_id', onDelete: 'CASCADE' });
CategoryLanguage.belongsTo(Category, { foreignKey: 'category_id' });

CategoryLanguage.belongsTo(Language, { foreignKey: 'language_id' });
Language.hasMany(CategoryLanguage, { foreignKey: 'language_id' });

(async () => {

    try {

        console.log('Connection DB-Category has been established successfully.');
        await Category.sync({ force: false });

    } catch (error) {
        console.error('Unable to connect to the database or create table:', error);
    } finally {
        //await dbInstance.close();
    }
    
})();
export default Category;
