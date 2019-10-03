const config = require('./config/env')
const app = require('./app')
const http = require('http')
//const fs = require('fs')
//const https = require('https')
const mongoose = require('mongoose')

// const { MongoMemoryServer } = require('mongodb-memory-server')
// const mongoServer = new MongoMemoryServer()

async function main() {
    //const connectionString = await mongoServer.getConnectionString()
    //mongoose.connect(config.MONGO_HOST, { useNewUrlParser: true, keepAlive: 1 })
    mongoose.connect(config.db.host, { useNewUrlParser: true, keepAlive: 1 })
    mongoose.connection.on('error', () => {
        throw new Error('Unable to connect to Mongo database')
    })


    // Certificate
    // const privateKey = fs.readFileSync('privkey.pem', 'utf8');
    // const certificate = fs.readFileSync('cert.pem', 'utf8');
    //const ca = fs.readFileSync('chain.pem', 'utf8');

    // const credentials = {
    //     key: privateKey,
    //     cert: certificate,
    //     ca: ca
    // }

    //const httpsServer = https.createServer(credentials, app);

    const httpServer = http.createServer(app);
    httpServer.listen(config.server.port, () => {
        console.log('HTTP Server running on port ' + config.server.port);
    })

    // httpsServer.listen(443, () => {
    //     console.log('HTTPS Server running on port 443');
    // })

}

main()
    .then(() => console.log('server started'))
    .catch(err => console.error('error to start server', err.toString()))
