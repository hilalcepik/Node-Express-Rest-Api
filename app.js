const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const { check , validationResult } = require('express-validator')

app.use(express.static('./public'))
app.use(morgan('short'))
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


//MySql Connection
const mysqlConnection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'nodehilal'
})


//MySql Connection Control
mysqlConnection.connect((err)=>{
  if(!err)
    console.log('DB connection succeded')
  else
    console.log('DB connection failed \n Error: ' + JSON.stringify(err,undefined,2))
})


//Listen 
app.listen(3003,() =>{  //localhost:3003
  console.log("Server is up and listening on 3003...")
})

module.exports = app;

const id = ''
//GET Function
app.get('/task/:id',(req,res)=>{  
  const userId = req.params.id
  const queryString = "SELECT * FROM nodehilal.tasks WHERE id = ? ";
  mysqlConnection.query(queryString,[userId],(err,rows,fields)=>{
  if(!err)    
    res.json(rows)
  else
    console.log("Failed..!!"+ err)
  }) 
})      


//POST Function
app.post(
  '/tasks',
  [ //VALIDATION
    check('i_id').not().isEmpty(),
    check('i_title').not().isEmpty(),
    check('i_description').not().isEmpty(),
    check('i_projectId').not().isEmpty(),
    check('i_dueDate').not().isEmpty(),
    check('i_status').not().isEmpty()
  ],  
  (req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty())
  {
    console.log(errors)
    return res.status(422).json({errors: errors.array()})
  }

  console.log("Trying to create a new task...!")  
  const id = req.body.i_id
  const title = req.body.i_title
  const description = req.body.i_description
  const project_id = req.body.i_projectId
  const due_date = req.body.i_dueDate
  const status = req.body.i_status

  const queryString = "INSERT INTO tasks(id,title,description,project_id,due_date,status) VALUES (?,?,?,?,?,?)"
  mysqlConnection.query(queryString,[id,title,description,project_id,due_date,status],(err,rows,fields)=>{
    if(err) 
    {
      console.log("failed to insert new task : " + err)
      res.sendStatus(500)
      return
    }   
     console.log("inserted a new task with id: ",rows.insertId)
     res.end()   
  })
})          