const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config();
const _dirname=path.resolve();

const app = express();
app.use(cors());
app.use(express.static(path.join(_dirname,"/todo_frontend/build")))
app.use(express.json());



mongoose.connect(process.env.MONGO_URI,
    console.log('MongoDB connected')
)

app.listen(process.env.PORT,
    console.log(`server-${process.env.PORT}`)
)

app.get('/',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"todo_frontend","build","index.html"))
})

app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
      .then(result => res.json(result))
      .catch(err => console.log(err));
   
});

app.get('/get',(req,res)=>{
  TodoModel.find().sort({_id:-1})
  .then(result=> res.json(result))
  .catch(err=>console.log(err));
});
  
app.put('/edit/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndUpdate(id,{done:true},{new:true})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.put('/update/:id',(req,res)=>{
  const{id} = req.params;
  const{task} = req.body;
  TodoModel.findByIdAndUpdate(id,{task:task})
  .then(result=> res.json(result))  
  .catch(err=>res.json(err));
 });

app.delete('/delete/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndDelete({_id:id})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 }); 

module.exports=app;
