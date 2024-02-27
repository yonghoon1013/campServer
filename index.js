const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
var bodyParser = require('body-parser')
const app = express()
require("dotenv").config();
const port = 3050

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://jyh10105:JzZoAOsA9VA5MSRD@cluster0.jmx3rgn.mongodb.net/camp?retryWrites=true&w=majority")
    .then(() => console.log('MongoDB Connected to database...'))
    .catch((e) => console.log('MongoDB error:', e))

    const memberSchema = new mongoose.Schema({
        id: String,
        pw: String,
        pwCheck: String,
        nick: String,
        key: String
    }, { collection: 'member' });
    
    const Member = mongoose.model('member', memberSchema);

    const favoriteSchema = new mongoose.Schema({
        contentId : String,
        key: String
    }, { collection: 'favorite' });
    
    const Favorite = mongoose.model('favorite', favoriteSchema);


app.get('/test', async (req, res) => {
    let data = await Member.find();
    res.json(data);
})


// 중복확인
app.get('/idCheck', async (req, res) => {
    const { id } = req.query;

    let data = await Member.find({id});
    
    if(data.length > 0){
        res.json(false);
    } else{
        res.json(true);
    }
})


// 회원가입
app.post('/sign', async (req, res) => {
    
    const qData = req.body;
    await Member.create(qData);

    let data = await Member.find();
    res.json(data);
})

// 로그인
app.get('/login', async (req, res) => {
    const { id, pw } = req.query;

    let data = await Member.findOne({id, pw});
    
    if(data){
        res.json(data);
    } else{
        res.json(false);
    }
})



app.get('/favPage', async (req, res) => {
    
    const { key, contentId } = req.query;

    let data = await Favorite.find({key: key});


    res.json(data);  
})

app.delete('/favPage', async (req, res) => {
    
    const { contentId, key } = req.query;
    await Favorite.deleteMany({key, contentId});
    let data = await Favorite.find({key: key});
    res.json(data);  
})


app.get('/fav', async (req, res) => {
    
    const { key, contentId } = req.query;

    let data = await Favorite.findOne({contentId, key});

    let dataAll = await Favorite.find({contentId: contentId});

    if(data){
        res.json({type: true, data: dataAll});
    } else{
        res.json({type: false, data: dataAll});
    }
})



app.post('/fav', async (req, res) => {
    
    const qData = req.body;
    await Favorite.create(qData);

    let data = await Favorite.find({contentId: qData.contentId});

    res.json({type: true, data: data});
})


app.delete('/fav', async (req, res) => {
    
    const { key, contentId } = req.query;

    await Favorite.deleteMany({key, contentId});
    let data = await Favorite.find({contentId: contentId});

    res.json({type: false, data: data});
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})