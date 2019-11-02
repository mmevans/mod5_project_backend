const { compare } = require('bcrypt')
const jwt = require('json-web-token')
const knex = require('knex')(require('./knexfile.js').development)
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
 
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/login', async (req, res ) => {
    const { email, password } = req.body.userData
    const [ user ] = await knex('users').where({ email })
    if(await compare(password, user.password_digest)){
        const result = await jwt.encode('asdljasldkfjs', { id: user.id } )
        res.json({ success: true, id: user.id, token: result.value })
    } else {
        res.json({ success: false, id: null })
    }
})

require('./controllers/user')(app, knex)
require('./controllers/collection')(app, knex)
require('./controllers/cards')(app, knex)

app.listen(3000)