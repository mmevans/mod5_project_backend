const { compare } = require('bcrypt');
const jwt = require('json-web-token');
const knex = require('knex')(require('./knexfile.js').development);
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000
const io = require('socket.io')(http);
const router = require('./websockets/sockets');
const cors = require('cors');
const {addPlayer, removePlayer, getPlayer, getPlayersInRoom, createGameMaster, getGameMaster} = require('./players/players');
const fetch = require('node-fetch');

app.use(cors())
 
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(router);


app.post('/login', async (req, res ) => {
    const { email, password } = req.body.userData
    const [ user ] = await knex('users').where({ email })
    if(await compare(password, user.password_digest)){
        const result = await jwt.encode('asdljasldkfjs', { id: user.id } )
        res.json({ success: true, id: user.id, token: result.value, username: user.username })
    } else {
        res.json({ success: false, id: null })
    }
})

io.on('connection', socket => {
    socket.on('join', async ({name, room}, callback) => {
        console.log('new connection')
        const player  = addPlayer({id: socket.id, name, room});
        if(player.error) {
            return null
        } else {
            const playerInGame = {id: socket.id, name, room}
            const url = 'http://localhost:3000/players-in-game/'
            const settings = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(playerInGame)
            }
            var res = await fetch(url, settings)
            var newPlayer = await res.json();
            socket.join(player.room)
            var gameMaster = getGameMaster(player.room)
            io.to(gameMaster.id).emit('get-players-in-room', room)
            callback();
        }
    })

    socket.on('create-game', async ({name, room}, callback) => {
        const gameMaster = createGameMaster({id: socket.id, name, room});
        socket.join(gameMaster.room)
        callback();
    })

    socket.on('game-started', (room, callback) => {
        socket.broadcast.emit('change-player-view')
        callback();
    })

    socket.on('send-answer-to-host', ({answers,room, playerName}, callback) => {
        console.log('Does this hit?')
        var player = {answers, room, playerName}
        console.log('the answer object', answers)
        var gameMaster = getGameMaster(player.room)
        console.log('game master', gameMaster)
        io.to(gameMaster.id).emit('get-answer-from-player', player)
        callback();
    })

    socket.on('disconnect', () => {
        const player = removePlayer(socket.id)
        if(player) {
            io.to(player.room).emit('message', {user: 'admin', text: `${player} has left!`})
        }
    })
})

require('./controllers/user')(app, knex)
require('./controllers/collection')(app, knex)
require('./controllers/cards')(app, knex)
require('./controllers/collectioncards')(app, knex)
require('./controllers/playersInGame')(app, knex)

http.listen(PORT, () => console.log(`Server is running on ${PORT}`))