module.exports = (app, knex) => {

    app.get('/collections', async (req, res) => {
        var collection = await knex('collections').select()
        res.json(collection)
    })

    app.post('/collections', async (req, res) => {
        const {name, user_id } = req.body
        const newCollection = { name, user_id }
        await knex('collections').insert(newCollection)
        res.json(newCollection)
    })

    app.get('/collections/:id', async (req, res) => {
        const { id } = req.params;
        const collection = await knex('collection').where({id}).select()

        res.json(collection)
        // create the card controller first. from here, call all the card that have the collection_id
    })
}