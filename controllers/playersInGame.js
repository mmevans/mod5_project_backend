
module.exports = (app, knex, io) => {


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
            points: 0
        }
        await knex('playersInGame').insert(newPlayer)
        res.json(newPlayer)
    })

    app.patch('/update-players', (req, res) => {
        const playersInRoom = req.body.playersInRoom
        let insertPromises = []
        playersInRoom.forEach(function(player) {
            insertPromises.push(
                knex('playersInGame')
                .where({'id': player.id})
                .update({'questions_round_1': JSON.stringify(player.questions_round_1), 'questions_round_2': JSON.stringify(player.questions_round_2), 'questions_round_3': JSON.stringify(player.questions_round_3)})
            )
            return Promise.all(insertPromises)
        })
    })

    app.get('/players-in-room/:id', async (req, res) => {
        const {id} = req.params
        var playersByRoom = await knex('playersInGame').where('room_id', id)
        res.json(playersByRoom)
    })

    app.patch('/update-player-answers', async (req, res) => {
        const {playerName, room, stage, answers_round_1} = req.body
            await knex('playersInGame')
                .where({'room_id': room, 'name': playerName})
                .update({'answers_round_1': JSON.stringify(answers_round_1)})
       

        let allPlayersInGame = await(
            knex('playersInGame')
                .where({'room_id': room})
                .select()
        )

        if(allPlayersInGame.every( player =>  player.answers_round_1 != null)){
            console.log("la tua")
            io.emit('ready-to-vote', { allPlayersInGame, selectedQuestion: 0 })
        }
        console.log(allPlayersInGame)
        res.send({ message: 'all good'})
    })

}

// ;(async function(){
// 	var length = 5
// 	var result                  = '';
//     var characters              = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength        = characters.length;
//     for ( var i = 0; i < length; i++ ) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
// 	console.log(`http://localhost:3001/main-lobby?name=user1&room=${result}&lobby=true`)
// 	console.log(`http://localhost:3001/main-lobby?name=Michael%20Evans&room=${result}`)
// 	console.log(`http://localhost:3001/main-lobby?name=Slow%20Loris&room=${result}`)
// 	console.log(`http://localhost:3001/main-lobby?name=Josh&room=${result}`)
// 	console.log(`http://localhost:3001/main-lobby?name=Hamburger&room=${result}`)
// })()