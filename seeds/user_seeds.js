const { hash } = require('bcrypt')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('collections').del()

  await knex('users').insert([
    { id: 1, username: 'user1', email: 'user1@gmail.com', password_digest: await hash('password1', 10) },
  ]);

  await knex('collections').insert([
    {name: 'Standard Collection', user_id: knex('users').first('id')}
  ])

  await knex('cards').insert([
    {prompt: "What two words would passengers never want to hear a pilot say?"},
    {prompt: "The secret to a happy life..."},
    {prompt: "The biggest downside to living in Hell"}
  ])

  await knex('collectioncards').insert([
    {collection_id: knex('collections').first('id'), card_id: knex('cards').first('id')},
    {collection_id: knex('collections').first('id'), card_id: 2},
    {collection_id: knex('collections').first('id'), card_id: 3}
  ])
};