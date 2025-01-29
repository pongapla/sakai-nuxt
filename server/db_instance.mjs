import { Sequelize } from 'sequelize';

const dbInstance = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || '192.168.100.93',
    port: parseInt(process.env.DB_PORT, 10), // Convert port to integer
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'DPower',
    database: process.env.DB_NAME || 'cock_new',
    logging: false // Set to true if you want to see SQL queries
});

(async () => {
    try {
        await dbInstance.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export default dbInstance;
