const mongoose = require('mongoose')

mongoose
  .connect(process.env.DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB run')
  })
  .catch(e => {
    console.log(e)
  })
