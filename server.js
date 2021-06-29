const express=require('express')
const app=express()
const bodyParser =require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Books',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('Books')
    app.listen(5000,()=>{
        console.log('Listening to port number 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    var mysort={BookId:1}
    db.collection('Book').find().sort(mysort).toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>{
    const newItem={
        "BookId": req.body.BookId,
       "Name":req.body.Name,
       "author":req.body.author,
       "stock":req.body.stock,
       "cost":req.body.cost
    }
    db.collection("Book").insertOne(newItem
    ,(err,result)=>{
        if(err) return res.send(err)
        console.log(req.body.BookId+" Book added")
        res.redirect('/')
    })
})

app.post('/update',(req,res)=>{
    db.collection('Book').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].BookId==req.body.BookId){
                s=result[i].stock
                break
            }
        }
        
        db.collection('Book').findOneAndUpdate({BookId:req.body.BookId},{
            $set:{stock:parseInt(s)+parseInt(req.body.stock)}},
            (err,result)=>{
                if(err) return res.send(err)
                console.log(req.body.BookId+ ' stock updated')
                res.redirect('/')
            })
    })
})

//Integer Updation
// app.post('/update',(req,res)=>{
//     db.collection('studentTable').find().toArray((err,result)=>{
//         if(err) return console.log(err)
//         for(var i=0;i<result.length;i++){
//             if(result[i].RollNo==req.body.RollNo){
//                 s=result[i].PhoneNo
//                 break
//             }
//         }
//         db.collection('studentTable').findOneAndUpdate({RollNo:req.body.RollNo},{
//             $set:{PhoneNo:parseInt(req.body.PhoneNo)}},
//             (err,result)=>{
//                 if(err) return res.send(err)
//                 console.log(req.body.RollNo+ ' stock updated')
//                 res.redirect('/')
//             })
//     })
// })

app.post('/delete',(req,res)=>{
    db.collection('Book').findOneAndDelete({BookId:req.body.BookId},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})