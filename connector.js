const mysql = require('mysql');
const sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

exports.initORM = new sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql'
});

exports.db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});