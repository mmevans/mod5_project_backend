
exports.up = function(knex) {
  return knex.schema.createTable('cards', function(t) {
      t.increments('id').primary()
      t.string('prompt')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('cards')
};
