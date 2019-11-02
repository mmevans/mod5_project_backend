
exports.up = function(knex) {
  return knex.schema.createTable('users', function(t){
        t.increments('id').primary()
        t.string('username').notNullable().unique();
        t.string('email').notNullable().unique();
        t.string('password_digest').notNullable().unique()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
