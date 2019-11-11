const { hash } = require('bcrypt')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('collections').del()
  await knex('collectioncards').del()
  await knex('cards').del()
  await knex('playersInGame').del()

  await knex('users').insert([
    { id: 1, username: 'user1', email: 'm@gmail.com', password_digest: await hash('1', 10) },
  ]);

  await knex('collections').insert([
    {name: 'Standard Collection', user_id: knex('users').first('id')}
  ])

  await knex('cards').insert([
    {prompt: "What two words would passengers never want to hear a pilot say?"},
    {prompt: "The biggest downside to living in Hell"},
    {prompt: "The most embarrassing crime to get caught committing"},
    {prompt: "The worst Halloween costume for a young child"},
    {prompt: "The unsexiest thought you can have"},
    {prompt: "The one phrase the NSA is tired of watching us type into Google"},
    {prompt: "The worst thing to find frozen in an ice cube"},
    {prompt: "How Garfield the cartoon cat will eventually die"},
    {prompt: "The worst family secret that could come out over Thanksgiving dinner"},
    {prompt: "The real reason the dinosaurs died"},
    {prompt: "What two words would passengers never want to hear a pilot say?"},
    {prompt: "What you wish you could say to yourself as a high schooler"},
    {prompt: "A great use for a dirty diaper"},
    {prompt: "How old-timey sailors passed the time on long voyages"},
    {prompt: "You know your baby boy is growing up too fast when he starts to _____"},
    {prompt: "Why the fish in your aquarium hate you"}
  ])

  await knex('collectioncards').insert([
    {collection_id: knex('collections').first('id'), card_id: knex('cards').first('id')},
    {collection_id: knex('collections').first('id'), card_id: 31},
    {collection_id: knex('collections').first('id'), card_id: 32},
    {collection_id: knex('collections').first('id'), card_id: 33},
    {collection_id: knex('collections').first('id'), card_id: 34},
    {collection_id: knex('collections').first('id'), card_id: 35},
    {collection_id: knex('collections').first('id'), card_id: 36},
    {collection_id: knex('collections').first('id'), card_id: 37},
    {collection_id: knex('collections').first('id'), card_id: 38},
    {collection_id: knex('collections').first('id'), card_id: 39},
    {collection_id: knex('collections').first('id'), card_id: 40},
    {collection_id: knex('collections').first('id'), card_id: 41},
    {collection_id: knex('collections').first('id'), card_id: 42},
    {collection_id: knex('collections').first('id'), card_id: 43},
    {collection_id: knex('collections').first('id'), card_id: 44},
    {collection_id: knex('collections').first('id'), card_id: 45},
  ])
};