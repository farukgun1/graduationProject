const { app, PORT } = require('./app')

app.listen(3001, () => {
  console.log(`Server is listening on port ${PORT}...`)
})
