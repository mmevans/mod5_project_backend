
exports.up = function(knex) {
  return knex.schema.createTable('questions', function(t){
      t.increments('id').primary()
      t.integer('user_id')
      .references('id')
      .inTable('users')
      t.string('description')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('questions')
};
