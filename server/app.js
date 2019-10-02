const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const app = express()


app.get('/ping', function (req, res) {
    return res.send('pong');
})

app.use(helmet())
app.use(morgan('tiny'))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../build')));
app.use(routes)
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app