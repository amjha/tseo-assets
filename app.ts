import {Photo} from './model';

const express = require('express');
const bodyParser = require('body-parser');
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('./check-auth');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const app = express();

require('dotenv').config();

import { connectionHandle } from './db';
const ont = require('./ont_data_category');
const units = require('./units');


const distFolder = './dist/parser-ui2/';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.get('*.*', express.static(distFolder, {maxAge: '1y'}));
app.all('/', function(req, res) {
    res.status(200).sendFile(`/`, {root: distFolder});
});

app.post('/api/login',  (req, res) => {

    const username = req.body.data.username,
        password = req.body.data.password;
    let msgBody;
    const client = ldap.createClient({
        url: 'ldap://10.42.52.20'
    });
    console.log('connecting..');
    client.bind(`NA\\${username}`, password, function(err) {
        if (err) {
            console.log(err.message);
            msgBody = {code: -1, status: err.message};
        } else {
            console.log('User connected!!');
            const token = jwt.sign({ userId: username}, 'cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ', {expiresIn: '1h'});
            msgBody = {code: 0, status: 'connected', token};
        }
        console.log(msgBody);
        client.unbind(function(error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('client disconnected');
            }
        });
        res.send(msgBody);


    });

});

app.get('/api/get_ont_category', (req, res) => {
    console.log('sending...');
    res.send(ont);
});

app.get('/api/get_units', (req, res) => {
    console.log('sending units...');
    res.send(units);
});


app.post('/api/posts', checkAuth, (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

// app.get('/api/photo', checkAuth, async (req, res, next) => {
//   const photoRepository = connectionHandle.getRepository(Photo);
//   const savedPhotos = await photoRepository.find();
//   console.log(savedPhotos);
//   res.send(savedPhotos);
// });


module.exports = app;
