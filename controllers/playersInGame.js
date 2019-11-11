
module.exports = (app, knex) => {


    app.get('/players-in-game', async (req, res) => {
        var playersInGame = await knex('playersInGame').select()
        res.json(playersInGame)
    })

    app.post('/players-in-game', async (req, res) => {
      const {name, room, id} = req.body
      const player = await knex('playersInGame').where({'room_id': room, 'socket_id': id}).select()

      var newPlayer = {
            name: name,
            socket_id:  id,
            room_id: room,
            points: 0,
            answers_round_1: [''],
            questions_round_1: [''],
            answers_round_2: [''],
            questions_round_2: [''],
            answers_round_3: [''],
            questions_round_3: ['']
        }
        await knex('playersInGame').insert(newPlayer)
        res.json(newPlayer)
    })

    app.patch('/update-players', async (req, res) => {
        const playersInRoom = req.body.playersInRoom
        let updatedPlayersInRoom = []
        console.log(playersInRoom)


        var update = await knex('playersInGame').where({'id': 76}).update({'name': 'DOES THIS WORK FOR THE LOVE OF GODDDDD'})
        res.json(update)
        for( const player of playersInRoom) {
            console.log("ROUND 1 questions", player.questions_round_1)
            var updatedPlayer =  await knex('playersInGame').where({'id': player.id}).update({'questions_round_1': knex.raw('array_append(questions_round_1, ?)', [player.questions_round_1])})
        }

        // res.json(updatedPlayersInRoom)
    })

    app.get('/players-in-room/:id', async (req, res) => {
        const {id} = req.params
        var playersByRoom = await knex('playersInGame').where('room_id', id)
        res.json(playersByRoom)
    })

}

