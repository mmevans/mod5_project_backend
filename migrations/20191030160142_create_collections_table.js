
exports.up = function(knex) {
    return knex.schema.createTable('collections', function(t){
        t.increments('id').primary()
        t.string('name')
        t.integer('user_id').references('id').inTable('users')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('collections')
};
