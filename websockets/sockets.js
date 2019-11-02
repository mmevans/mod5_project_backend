module.exports = (app) => {
    const express = require('express')
    const app = express()

    var server = app.listen(3000, function() {
        console.log('this server is listening on port 3000')
    })
}