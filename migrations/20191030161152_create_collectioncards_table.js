
exports.up = function(knex) {
  return knex.schema.createTable('collectioncards', function(t) {
      t.increments('id').primary()
      t.integer('collection_id')
      .references('id')
      .inTable('collections')
      t.integer('card_id')
      .references('id')
      .inTable('cards')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('collectioncards')
};
