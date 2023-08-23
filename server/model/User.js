import mongoose from "mongoose";
import bcrypt from 'bcrypt'


export const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, "Please provide a user name"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    email: {
        type: String,
        required: [true, "please Provide a valid email"],
        unique: [true, "Email already exist"]
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number},
    profile: { type: String },
    country: { type: String },
    city: { type: String},
    state: { type: String },
    dob: Date,
    acctBalance: {
        type: Number, 
        default: 0,
    },
    transactionTotal: {
        type: Number,
        default: 0,
    },
},
{minimize: false}
);

UserSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() // {password: "..."}
    if (update.password) {
      const passwordHash = await bcrypt.hash(update.password, 10);
      this.setUpdate({ $set: { 
         password: passwordHash, 
         confirmpw: undefined 
        } 
      });
    }
    next()
});


UserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash
            next();
        })
    })
})

UserSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject
}

UserSchema.statics.findByCredentials = async function(email, password){
    const user = await UserModel.findOne({email});
    if(!user) throw new Error('Invalid Email or Password ')

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid email or password')
    
    return user
}

const UserModel =  mongoose.model('bravesubUser', UserSchema);
export default UserModel