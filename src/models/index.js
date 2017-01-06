import fs from 'fs';
import path from 'path';

const db = {};
const Sequelize = require('sequelize');
const config = require('../config/database.json')[process.env.NODE_ENV || 'development'];
/**
 * Database config
 * config file : config/database.json
 */
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, {
        host: config.location,
        dialect: config.driver,
        logging: false,
    },
);

fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && file.indexOf('.map') < 0;
    })
    .forEach((file) => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
