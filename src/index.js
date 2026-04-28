import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hola mundo desde Express')
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})