const mongoose = require('mongoose')
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,
        // {
        //     useNewUrlParser:true,
        //     useUnifiedTopology:true
        // }
        )
    .then(
        console.log("DB connected succesfully")
    )
    .catch((error)=>{
        console.log(error)
        console.log("faild to connect DB");
        process.exit(1)
    })
}