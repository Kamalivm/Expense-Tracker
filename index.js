/**
 * npm init --y
 * npm install nodemon --save-dev
 * create a file .gitignore ->in the file which ignores all this /node_modules,/package-lock.json,/.gitignore
 */

/**
 * Expense Tracker
 * 
 * Features
 * 
 * Adding a new expense / income : /add-expense -> post request
 * Displaying existing expenses : /get-expense -> get request
 * Editing existing entries : /edit-expense -> patch/put request
 * Deleting expenses : /delete-expense -> delete request
 * 
 * Budget reporting
 * Creating new user
 * Validating user
 * 
 * Defining schema
 * category, amount, date
 */

//mongoose -> schema create,database connect
//bodyparser is used to handle post request its an component of express
//express used to build web and mobile application

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const {Expense} = require('./schema.js')
const cors = require('cors')

const app = express()

//connect
async function connecttoDB(){
    //async returns promises
    try{
        await mongoose.connect('mongodb+srv://Kamali:kamali_445@cluster0.qxlvbz0.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0') 
        console.log('Db Connnectin Established :)')
        // const x = process.env.PORT //port number will be given by itself
        const port = process.env.PORT || 3000
        app.listen(port,function(){
            console.log(`Listining to the ${port}...`)
        })
    }
    catch(error){
        console.log(error)
        console.log('Couldn\'t connect to this network :(')
    }
}
connecttoDB()

app.use(bodyParser.json())
app.use(cors())

app.post('/add-expense',async function(request,response){
    // console.log(request.body)
    // response.json({
    //     'status':'created'
    // })

    // creating the data to read from the request body of the postman
    //accessing the modle from the schema ->Expense
    try{
        //this block is  used to add the data from postman(request body) to mongodb compass or atlas
        await Expense.create({
            "amount" : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        response.status(201).json({
            "status" : "success",
            "message" : "new entry created "
        })
    }
    catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
})

app.get('/get-expense',async function(request,response){
    try{
        const expensesData = await Expense.find()
        response.status(200).json(expensesData)
    }
    catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "couldn/'t fetch entries",
            "error" : error
        })
    }
})

//localhost:3000/delete-expense/65e6a57c6812d6b450a7af42
//localhost:3000/delete-expense/<params>
app.delete('/delete-expense/:id',async function(request,response){
    try{
        const expenseData = await Expense.findById(request.params.id)
        if(expenseData){
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status":"success",
                "message":"deleted entry"
            })
        }
        else{
            response.status(404).json({
                "status":"failure",
                "message":"couldn'/t find the document"
            })
        }
    }
    catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "couldn/'t delete entries",
            "error" : error
        })
    }
})

app.patch('/edit-expense/:id',async function(request,response){
    try{
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry){
            await expenseEntry.updateOne({
                "amount" : request.body.amount,
                "category" : request.body.category,
                "date" : request.body.date
            })
            response.status(200).json({
                "status":"success",
                "message":"updated entry"
            })
        }
        else{
            response.status(404).json({
                "status":"failure",
                "message":"couldn'/t find the document"
            })
        }
    }
    catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "couldn/'t delete entries",
            "error" : error
        })
    }
})