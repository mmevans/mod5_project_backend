

module.exports = (app, knex) => {

    app.get('/collectioncards', async (req, res) => {
        let collectionCards =  await knex('collectioncards')
        .select('cards.prompt', 'collections.name', 'collections.id')
        .join('collections', 'collections.id', 'collectioncards.collection_id')
        .leftJoin('cards', 'cards.id', 'collectioncards.card_id')
        res.json(collectionCards)
    })

}   