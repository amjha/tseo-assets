process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const bodyParser = require('body-parser');
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');

const app = express();

import { resolve } from "path";
import { config } from "dotenv";
config({ path: resolve(__dirname, "../.env") });

import { connectionHandle } from './db';
import { checkAuth } from './checkAuth';
import {Photo} from './model';
const distFolder = '../dist/';

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
    const ldapServer = process.env.LDAP;
    const username = req.body.data.username,
          password = req.body.data.password;
    let msgBody;
    const client = ldap.createClient({
        url: `ldap://${ldapServer}`
    });
    
    client.bind(username, password, function(err) {
        if (err) {
            console.log(err.message);
            msgBody = {code: -1, status: err.message};
        } else {
            const token = jwt.sign({ userId: username}, process.env.JWT_SECRET, {expiresIn: '1h'});
            msgBody = {code: 0, status: 'connected', token};
        }
        client.unbind(function(error) {
            if (error) {
                console.error(error.message);
            }
        });
        res.send(msgBody);
    });
});

app.post('/api/posts', checkAuth, (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/photo', checkAuth, async (req, res, next) => {
  const ontologyRepository = await connectionHandle();
  const ontData = await ontologyRepository.find();
  res.send(ontData);
});


module.exports = app;
