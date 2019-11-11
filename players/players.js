const players = [];

const gameMasters = [];


const createGameMaster = ({id, name, room}) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()
    const gameMaster = {id, name, room}
    gameMasters.push(gameMaster)
    return gameMaster
}

const getGameMaster = (room) => {
    room = room.trim().toLowerCase()

    const gameMaster = gameMasters.find((player) => player.room === room)

    return gameMaster
}

const addPlayer = ({id, name, room}) => {
    // Javascript Mastery = javascriptmaster

    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const exisitingPlayer = players.find((player) => player.room === room && player.name === name)
    const gameMaker = gameMasters.find((player) => player.room === room && player.name === name)
    if(exisitingPlayer || gameMaker) {
        return {error: 'User has already joined!'}
    } 
    const player = {id, name, room}
    players.push(player)
    return player
}

const removePlayer = (id) => {
    const index = players.findIndex((player) => player.id === id);

    if(index !== -1) {
        return players.slice(index, 1)[0]
    }
}

const getPlayer = (id) => players.find((player) => player.id === id);

const getPlayersInRoom = (room) => players.filter((player) => player.room === room)

module.exports = {addPlayer, removePlayer, getPlayer, getPlayersInRoom, createGameMaster, getGameMaster}