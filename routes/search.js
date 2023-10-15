const express = require('express');
var User = require('../models/users');
var Group = require('../models/group');

const routerSearch = express.Router();
const cors = require('./cors');
var authenticate = require('../authenticate');
const { scopeRegex } = require('../helpers/libs');

routerSearch.use(express.json());

routerSearch.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

routerSearch.get('/app-members', cors.corsWithOptions, (req, res, next) => {
  if (req.query.q) {
    const regex = new RegExp(scopeRegex(req.query.q), 'gi');
    // console.log("refex", regex);
    User.find ({ username: regex})
    .then((resp, err) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }
    })
    .catch(err => {
      console.log("err", err);
    })
  }
})
routerSearch.get('/group-members/:groupId', cors.corsWithOptions, (req, res, next) => {
  if (req.query.q) {
    const regex = new RegExp(scopeRegex(req.query.q), 'gi');

    Group.findById(req.params.groupId)
      .populate('members')
      .then((group) => {
        let searchMembers = group.members.filter((user) => { regex.test(user.username) })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(searchMembers);
      })
    // User.find({ firstname: regex }, (err, user) => {
    //   if (err) {
    //     res.statusCode = 500;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json({ err: err });
    //   } else {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(user);
    //   }
    // })

  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({});
  }
})
module.exports = routerSearch;