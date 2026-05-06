const app = require('./app')
const { PORT } = require('./config/env')

app.listen(PORT, () => {
  console.log(`Class Diary server running at http://127.0.0.1:${PORT}`)
})
