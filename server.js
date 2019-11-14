const { compare } = require('bcrypt');
const jwt = require('json-web-token');
const knex = require('knex')(require('./knexfile.js').development);
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = 3000
const io = require('socket.io')(http);
const router = require('./websockets/sockets');
const cors = require('cors');
const { addPlayer, removePlayer, getPlayer, getPlayersInRoom, createGameMaster, getGameMaster } = require('./players/players');
const fetch = require('node-fetch');

app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(router);


app.post('/login', async (req, res) => {
    const { email, password } = req.body.userData
    const [user] = await knex('users').where({ email })
    if (await compare(password, user.password_digest)) {
        const result = await jwt.encode('asdljasldkfjs', { id: user.id })
        res.json({ success: true, id: user.id, token: result.value, username: user.username })
    } else {
        res.json({ success: false, id: null })
    }
})

app.post('/generate-questions', async (req, res) => {

    const room = req.body.room

    const allPlayers = await knex('playersInGame')
        .where({ 'room_id': room })
        .select()

    const questions =  await knex('collectioncards')
        .select('cards.prompt', 'collections.name', 'collections.id')
        .join('collections', 'collections.id', 'collectioncards.collection_id')
        .leftJoin('cards', 'cards.id', 'collectioncards.card_id')


    var playersInRoom = allPlayers.filter((player) => player.room_id === room)

    var count = 0;

    playersInRoom.forEach((player) => {
        player.questions_round_1 = [];
        player.questions_round_2 = [];
        player.questions_round_3 = [];
        player.answers_round_1 = [];
        player.answers_round_2 = [];
        player.answers_round_3 = [];
    })

    var questions_round_1 = []
    while (count !== (playersInRoom.length)) {
        var question = {}
        var user1 = playersInRoom[Math.floor(Math.random() * playersInRoom.length)]
        var user2 = playersInRoom[Math.floor(Math.random() * playersInRoom.length)]

        if (user1.name === user2.name || user1.questions_round_1.length === 2 || user2.questions_round_1.length === 2 || ((user1.questions_round_1[user1.questions_round_1.length - 1] === user2.questions_round_1[user2.questions_round_1.length - 1]) && user1.questions_round_1[0] !== undefined)) {
            continue
        }

        user1.questions_round_1.push(questions[Math.floor(Math.random() * questions.length)])

        var addedQuestion = user1.questions_round_1[user1.questions_round_1.length - 1]
        var index = questions.indexOf(addedQuestion)
        questions.splice(index, 1)
        user2.questions_round_1.push(user1.questions_round_1[user1.questions_round_1.length - 1])
        // eslint-disable-next-line no-loop-func
        playersInRoom.forEach((player) => {
            if (user1.name === player.name) {
                player.questions_round_1 = user1.questions_round_1
            }
            if (user2.name === player.name) {
                player.questions_round_1 = user2.questions_round_1
            }
        })
        question = {
            prompt: addedQuestion.prompt,
            players: [user1.name, user2.name],
            answers: [],
            points_player_1: 0,
            points_player_2: 0

        }
        questions_round_1.push(question)
        count++;
    }


    var questions_round_2 = []
    var count2 = 0
    while (count2 !== (playersInRoom.length)) {
        var questionRound2 = {}
        user1 = playersInRoom[Math.floor(Math.random() * playersInRoom.length)]
        user2 = playersInRoom[Math.floor(Math.random() * playersInRoom.length)]
        if (user1.name === user2.name || user1.questions_round_2.length === 2 || user2.questions_round_2.length === 2 || ((user1.questions_round_2[user1.questions_round_2.length - 1] === user2.questions_round_2[user2.questions_round_2.length - 1]) && user1.questions_round_2[0] !== undefined)) {
            continue
        }
        user1.questions_round_2.push(questions[Math.floor(Math.random() * questions.length)])
        addedQuestion = user1.questions_round_2[user1.questions_round_2.length - 1]
        index = questions.indexOf(addedQuestion)
        questions.splice(index, 1)
        user2.questions_round_2.push(user1.questions_round_2[user1.questions_round_2.length - 1])
        // eslint-disable-next-line no-loop-func
        playersInRoom.forEach((player) => {
            if (user1.name === player.name) {
                player.questions_round_2 = user1.questions_round_2
            }
            if (user2.name === player.name) {
                player.questions_round_2 = user2.questions_round_2
            }
        })
        questionRound2 = {
            prompt: addedQuestion.prompt,
            players: [user1.name, user2.name],
            answers: [],
            points_player_1: 0,
            points_player_2: 0
        }
        questions_round_2.push(questionRound2)
        count2++;
    }
    playersInRoom.forEach((player) => {
        player.questions_round_3.push(questions[0], questions[1])
    })

    await Promise.all(playersInRoom.map( async player => {
        await knex('playersInGame')
                .where({'id': player.id})
                .update({
                    'questions_round_1': JSON.stringify(player.questions_round_1), 
                    'questions_round_2': JSON.stringify(player.questions_round_2), 
                    'questions_round_3': JSON.stringify(player.questions_round_3)
                })
    }))

    io.emit('change-player-view', { questions_round_1, questions_round_2 })

    res.send({ questions_round_1, questions_round_2 })
})

io.on('connection', socket => {
    socket.on('join', async ({ name, room }, callback) => {
        console.log('new connection')
        const player = addPlayer({ id: socket.id, name, room });
        if (player.error) {
            return null
        } else {
            const playerInGame = { id: socket.id, name, room }
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

    socket.on('create-game', async ({ name, room }, callback) => {
        const gameMaster = createGameMaster({ id: socket.id, name, room });
        socket.join(gameMaster.room)
        callback();
    })

    socket.on('send-answer-to-host', ({ answers, room, playerName }, callback) => {
        var player = { answers, room, playerName }
        var gameMaster = getGameMaster(player.room)
        io.to(gameMaster.id).emit('get-answer-from-player', player)
        callback();
    })
    
    socket.on('cast-vote-round-1', (answer, room, callback) => {
        io.emit('cast-vote-round-1-to-host', answer)
        callback();
    })

    socket.on('go-to-next-question', (callback) => {
        io.emit('cast-go-to-next-question')
        callback();
    })

    socket.on('disconnect', () => {
        const player = removePlayer(socket.id)
        if (player) {
            io.to(player.room).emit('message', { user: 'admin', text: `${player} has left!` })
        }
    })
})

require('./controllers/user')(app, knex)
require('./controllers/collection')(app, knex)
require('./controllers/cards')(app, knex)
require('./controllers/collectioncards')(app, knex)
require('./controllers/playersInGame')(app, knex, io)

http.listen(PORT, () => console.log(`Server is running on ${PORT}`))