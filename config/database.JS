const mongoose = require("mongoose");

const connectDatabase = () => {
mongoose.connect("mongodb+srv://Aqeel:aqeel12345@cluster0.uhg7y9z.mongodb.net/visiosparkwebsite?retryWrites=true&w=majority", {
    usenewUrlParser:true ,
    useUnifiedTopology:true
})
.then (
        (data)=> {
            console.log(`Mongodb connected with server: ${data.connection.host}`);

        }
    )
}
module.exports = connectDatabase