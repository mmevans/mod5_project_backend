
exports.up = function(knex) {
    return knex.schema.createTable('playersInGame', function(t){
        t.increments('id').primary()
        t.string('socket_id')
        t.string('name')
        t.string('room_id')
        t.integer('points')
        t.json('answers_round_1').nullable()
        t.json('questions_round_1').nullable()
        t.json('answers_round_2').nullable()
        t.json('questions_round_2').nullable()
        t.json('answers_round_3').nullable()
        t.json('questions_round_3').nullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('playersInGame')
};
