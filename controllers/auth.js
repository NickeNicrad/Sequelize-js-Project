const {db} = require('./connector');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// create new account
exports.signup = (req, res) =>
{
    try {
        const {fname, lname, email, phone, password, passwordConfirm} = req.body;

    if (password !== passwordConfirm)
    {
        res.render('signup', {message: 'Passwords do not match'});
    } else
    {
        db.query('select email from users where email = ?', [email], async (err, result) =>
        {
            if (err) throw console.log(err);
            if (result.length > 0)
            {
                res.render('signup', {
                    message: 'E-Mail is already used'
                })
            } else
            {
                const hashpass = await bcrypt.hash(password, 8);
                db.query('INSERT INTO users SET ?', {fname, lname, email, phone, password: hashpass}, (err, result) =>
                {
                    if (err) throw console.log(err);
                    res.render('signup', {
                        message: 'Successfuly Saved!'
                    })
                })
            }
        });
    }
    } catch (error) {
        return console.log(error);
    }
}
// login into an existing account
exports.login = (req, res) =>
{
    try {
        const {email, password} = req.body;
        // if (!email || !password)
        // {
        //     return res.status(400).render('login', {message: 'Please provide E-Mail and Password before to continue'});
        // }
        db.query('SELECT * FROM users where email = ?', [email], async (err, result) =>
        {
            // checking for error in email selecting query
            if (err) throw console.log(err);
            // in case there is no error found in the query
            if(result.length === 0){ res.render('login', {message: `Account doesn't exist\nPlease Create One`})}
            else if (!(await bcrypt.compare(password, result[0].password)))
            {
                return res.status(401).render('login', {message: 'Incorrect E-Mail or Password'});
            } else
            {
                const id = result[0].id;
                const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');
            }
        })
    } catch (err) {
        console.log(err);
    }
}