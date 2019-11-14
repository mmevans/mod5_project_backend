
module.exports = (app, knex) => {

    app.get('/cards', async (req, res) => {
        let cards = await knex('cards').select()
        res.json(cards)
    })
}