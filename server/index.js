const env = require('./config/env')
const app = require('./app')
const http = require('http')
const fs = require('fs')
//const https = require('https')

async function main() {
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
    httpServer.listen(env.server.port, () => {
        console.log('HTTP Server running on port ' + env.server.port);
    })

    // httpsServer.listen(443, () => {
    //     console.log('HTTPS Server running on port 443');
    // })

}

main()
    .then(() => console.log('server started'))
    .catch(err => console.error('error to start server', err.toString()))
