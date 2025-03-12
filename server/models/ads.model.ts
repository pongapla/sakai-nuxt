import { DataTypes } from 'sequelize';
import dbInstance from '../db_instance';

// เริ่มต้นประกาศ AdsLanguage ก่อน
import AdsLanguage from './ads_language.model';
import Language from './language.model';

// สร้างโมเดล Ads
const Ads = dbInstance.define('Ads', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_popup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_slide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_news_content: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_list: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'IsActive'
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    stop_date: {
        type: DataTypes.DATE,
        allowNull: false
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

Ads.hasMany(AdsLanguage, { foreignKey: 'ads_id', as: 'adsLanguages', onDelete: 'CASCADE' });
AdsLanguage.belongsTo(Ads, { foreignKey: 'ads_id', as: 'ads'});

AdsLanguage.belongsTo(Language, { foreignKey: 'language_id', as: 'language' });
Language.hasMany(AdsLanguage, { foreignKey: 'language_id' });

(async () => {
    try {
       
        console.log('Connection to DB_Ads has been established successfully.');

        await Ads.sync({ force: false });
        console.log('Ads table has been created successfully.');
    } catch (error) {
        console.error('Unable to connect to the database or create table:', error);
    } finally {
        // await dbInstance.close();
    }
})();

export default Ads;
