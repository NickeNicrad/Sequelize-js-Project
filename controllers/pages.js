const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({path: '../.env'});

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect({err: mysql.MySqlError}, () =>
{
    console.log(err);
});

exports.createEmployee = (req, res) =>
{
    const {fname, lname, email, phone, gender, country} = req.body;
    console.log(req.body)
    try
    {
        const query = db.query('SELECT * FROM employees WHERE email = ?', [email], (err, result) =>
        {
            if (err) throw console.log(err);
            if (result.length > 0)
            {
                db.query('INSERT INTO employees SET ?', {fname, lname, email, phone, gender, country}, (err, result) =>
                {
                    if (err) throw console.log(err);
                    console.log('employee saved!');
                    res.render('index')
                })
            }
        })
    } catch (error) {
        console.log(error);
        console.log(query);
    }
}
