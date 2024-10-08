import { DataTypes } from 'sequelize';
import dbInstance from '../db_instance';

const UserGetCoupon = dbInstance.define('User_Get_Coupons', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    get_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    get_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
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
        await dbInstance.authenticate(); // ทดสอบการเชื่อมต่อ
        console.log('Connection DB-User_get_coupon has been established successfully.');

        await UserGetCoupon.sync({ force: false });
    } catch (error) {
        console.error('Unable to connect to the database or create table:', error);
    } finally {
        //await dbInstance.close(); // ปิดการเชื่อมต่อ
    }
})();
export default UserGetCoupon; // ตรวจสอบว่ามีการส่งออกแบบนี้
