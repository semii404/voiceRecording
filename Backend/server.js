import express from 'express';
import bodyParser from 'body-parser';
import path, { resolve } from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import multer from 'multer';
//import GridFsStorage from 'multer-gridfs-storage';
import { GridFsStorage } from 'multer-gridfs-storage';
import  Grid  from 'gridfs-stream';
import  MethodOverride  from 'method-override';

import cors from 'cors';


const app=express();
const port = 5000;



//app.use(cors);
app.use(bodyParser.json());

app.use(MethodOverride('_method'));
//app.set('view engine','ejs');
app.use(cors());



//mogourl
const CONNECTION_URL = 'mongodb+srv://semii:semii123@cluster0.xkton.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';



//mongo connection
const conn = mongoose.createConnection(CONNECTION_URL);



//init gfs
let gfs;

conn.once('open', ()=>{
    //init stream
    gfs= Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});


//this is bucket configuration
//create storage engine
const storage = new GridFsStorage({
    url: CONNECTION_URL,
    file: (req,file)=>{
        return new Promise((resolve,reject)=>{
            crypto.randomBytes(16, (err,buf)=>{
                if(err){
                    return reject(err);
                }
                const filename = buf.toString('hex')+ path.extname(file.originalname);
                const fileinfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileinfo);
            });
        });
    }
});

const upload = multer({storage});



//route get
//load form

/*app.get('/',(req,res)=>{
    res.render('index')

});
*/


//route for file upload (post single file)
app.post('/upload', upload.single('file'), (req,res)=>{
    res.json({file:req.file});
})





app.listen(port,()=> console.log(`Server running on port: ${port}`));
