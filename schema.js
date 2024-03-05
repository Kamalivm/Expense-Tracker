const mongoose = require('mongoose')
//defining schema 
const expenseTrackerSchema= new mongoose.Schema({
    amount : {
        type : Number
    },
    category : {
        type : String
    },
    date : {
        type : String
    }
})

//first parameter -> collection name we create 
//second parameter -> schema variable
const Expense = mongoose.model('ExpenseDetails',expenseTrackerSchema)

module.exports = {Expense}