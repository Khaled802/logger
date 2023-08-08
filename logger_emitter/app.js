const express = require('express');
const amqp = require('amqplib');
const bodyParser = require('body-parser');
require('dotenv').config();


const Producer = require('./producer');


const app = express();

const producer = new Producer();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json())


app.post('/send_log', async (req, res, next)=> {
    const { routingKey, message } = req.body;
    try {
        await producer.produceMessage(routingKey, message);
        res.json({msg: "send successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }

});

app.listen(3000, ()=> console.log('server started at http://localhost:3000'));