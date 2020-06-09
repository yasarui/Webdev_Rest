const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to db");
}).catch(()=>{
    console.log("Not connected to db");
})