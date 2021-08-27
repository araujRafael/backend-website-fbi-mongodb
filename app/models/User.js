const {mongoose} = require("../../database/mongoConnection")

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true,
        select: false,
    },
    passResetToken:{
        type: String,
        select: false
    },
    passResetExpires:{
        type: Date,
        select: false,
    }
},{
    versionKey: '_version',
    timestamps: true
})

const User = mongoose.model("User",UserSchema)
module.exports = {User}