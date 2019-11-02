
exports.up = function(knex) {
  return knex.schema.createTable('answers', function(t){
      t.increments('id').primary()
      t.string('description')
      t.integer('question_id')
      .references('id')
      .inTable('questions')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('answers')
};
