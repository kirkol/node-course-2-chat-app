const path = require('path')
const express = require('express')

//pobranie sciezki do folderu public
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const app = express()

//ustawienie middleware'a expressa
//express jako server udostepni katalog publiczny (ponizej ustawiamy jego sciezke)
app.use(express.static(publicPath))

//usatwienie nasluchu na porcie 3000 (na razie deweloperski tylko)
app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = {
  app
}