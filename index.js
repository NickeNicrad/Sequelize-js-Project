const express = require('express');
const hbs = require('handlebars');
const path = require('path');
const {initORM} = require('./connector.js');
const app = express();

const PORT = process.env.PORT || 5000;

initORM.authenticate()
    .then(() => console.log('database successfully connected!'))
    .catch(err => console.log('Error', err));

app.get('/', (req, res) =>
{
    res.send('body: '+ req.body);
})

app.listen(PORT, console.log('server runnig on port: ', PORT));
