const express = require('express');
const app = express();
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/user', (req, res) => {
    res.send('Got a POST request')
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/api/info', (req, res) => {
  console.log('GET /api/info')
  const info = {
      studentName: 'Gijs van Vugt',
      studentNumber: '2216616',
      description: 'Een API server voor periode 4 Programmeren 4.'
  }
  res.json(info)
});
