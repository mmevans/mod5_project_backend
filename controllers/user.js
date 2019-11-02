
module.exports = (app, knex) => {


    app.get('/users', async (req, res) => {
        let users = await knex('users').select()
        res.json(users)
    })

    app.post('/users', async (req, res) => {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hashSync(req.body.userData.password_digest, saltRounds)
        const newUser = {
            username: req.body.userData.username,
            email: req.body.userData.email,
            password_digest: hashedPassword
        }
         
       await knex('users').insert(newUser)
       res.json(newUser)
    })
}
