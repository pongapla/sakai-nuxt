import { DataTypes } from 'sequelize';
import dbInstance from '../db_instance';
import Ads from './ads.model';
import Language from './language.model';

// สร้าง AdsLanguage Model
const AdsLanguage = dbInstance.define('Ads_Languages', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ads_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Ads',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    language_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Languages',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    cover_picture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    view: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
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
        console.log('Connection DB_Ads_Language has been established successfully.');
        await AdsLanguage.sync({ force: false }); // Sync Model กับ Database
    } catch (error) {
        console.error('Unable to connect to the database or create table:', error);
    } finally {
        // await dbInstance.close();
    }
})();

export default AdsLanguage;
