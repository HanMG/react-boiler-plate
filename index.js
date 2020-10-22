const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// MongoDB key
const config = require('./config/key')

// userModel
const { User } = require("./models/User")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// application/json
app.use(bodyParser.json())

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))




app.get('/', (req, res) => res.send('Hello, It is default Page'))


app.post('/register',(req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 DB에 넣어준다.    
    const user = User(req.body)    

    user.save((err, userInfo) =>{
        if(err) return res.json({ success: false, err})
        return res.status(200).json({ success: true })
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))