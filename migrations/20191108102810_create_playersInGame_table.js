
exports.up = function(knex) {
    return knex.schema.createTable('playersInGame', function(t){
        t.increments('id').primary()
        t.integer('socket_id')
        t.string('name')
        t.string('room_id')
        t.integer('points')
        t.specificType('answers_round_1', 'text[]');
        t.specificType('questions_round_1', 'text[]')
        t.specificType('answers_round_2', 'text[]');
        t.specificType('questions_round_2', 'text[]')
        t.specificType('answers_round_3', 'text[]');
        t.specificType('questions_round_3', 'text[]')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('playersInGame')
};
