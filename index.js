const express = require('express');
const app = express();
const port = 4999;
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const mongoose = require('mongoose');
const Message = require('./models/chat_schema');
const mongoURI = 'mongodb://localhost:27017/Chatapp';


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB is connected successfully');
}).catch((err) => {
    console.log('MongoDB connection error', err);
});

app.use(express.urlencoded({ extended: true }));// this is used to handle the incoming data i.e chat
app.use(express.static('public'));// this helps us to use the files in public folder

let items = []; // (empty object)without the database we store it in this and on every refresh this is recreated.
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.render('index');// without this where is the form for the chat supposed to come? 
})

io.on('connection', (socket) => { // here the socket is the input for the arrow function
    console.log('a user connected');

    Message.find().sort({ created: -1 }).then(messages => {

        socket.emit('init', messages);
    })
    socket.on('chat message', (msg) => {
        // console.log('message: ' + msg);
        const message = new Message({ content: msg });
        message.save()
            .then(savedMessage => {
                console.log("saved successfully", savedMessage);
                io.emit('chat message', msg);
            })
            .catch((err) => {
                console.error('Error saving message:', err);
            })        

    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})