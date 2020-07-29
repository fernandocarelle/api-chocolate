const bcrypt = require('bcryptjs');
const mongoose = require('../../config/db.js');

const UserSchema = mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
        },
        name:{
            type: String,
            required: true,
        },
        pass:{
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre('save', async function (next) {
    const hashPass = await bcrypt.hash(this.pass, 10);
    this.pass = hashPass;
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;