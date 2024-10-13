const mongoose = require("mongoose")

const EmployeeSchema = mongoose.Schema({
    name: String,
    age:Number,
    email:String,
    phone:String,
    role:String,
    salary:Number,
})

module.exports = mongoose.model("Employee",EmployeeSchema)