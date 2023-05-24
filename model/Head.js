const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
///schema represent documenet mtlb ju hum database data save krthy hae wu humy kis tara chaiyae hothy us liyae used krthy hae
const userShema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cpassword: {
        type: String,
        require: true
    },
    label: String,
    value: Number,
    image: {
        type: String,
        // require: true
       
    },
    tokens: [
        {
            token:{
                type: String,
                require: true

            }
        }
    ]
}, { timestamps: true }


)
//we are hashing a password

userShema.pre('save', async function (next) {
    console.log('hi from inside')
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)

    }
    next();
})
// we are generating a token
userShema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token; 

    }
    catch (err) {
        console.log(err);
    }


    userShema.methods.deleteToken=function(token,cb){
        var user=this;
    
        user.update({$unset : {token :1}},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    }
}
//delete token
const User = mongoose.model('USER', userShema )
module.exports= User;