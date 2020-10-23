const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        defafult: 0
    },
    image: String,
    token: {
        type: String,        
    },
    tokenExp: {
        type: Number
    }
})

// 저장시 비밀번호 암호화
userSchema.pre('save', function(next){
    var user = this;  

    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) { // hash = 암호화된 비밀번호
                if(err) return next(err)
                // Store hash in your password DB.
                user.password = hash            
                next()
            })
        })   
    } else{
        next()
    }     
})

// 로그인시 입력한 비밀번호를 DB에서 불러온 암호와 비교
userSchema.methods.comparePassWord = function(plainPassword, cb){

    // 입력한 비밀번호를 암호화하여 DB의 암호와 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //console.log('user._id', user._id)
    // jsonwebtoken을 이용하여 token을 생성하기
    // user._id + 'secretToken' = token
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })    
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode 한다.    
    jwt.verify(token,'secretToken', function(err, decoded){
        // 유저아이디를 이용해서 유저를 찾은 후
        // 클라이언트에서 가져온 토큰과 DB에 가져온 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}


const User = mongoose.model('User',userSchema);

module.exports = {User}