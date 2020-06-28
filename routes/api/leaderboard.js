const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

///Item model
const User = require('../../models/User');

//@route    GET api/items
//@desc     Get all Items
// @access  Public
router.get('/', (req,res)=>{
    User.find().sort({wins: -1}).limit(10).exec((err,users)=>{
        if(err) return console.log(err);
        var userList = [];
        users.forEach(elem=>{
          userList.push({name: elem.name, wins: elem.wins});
        });
        res.json(userList);
      });
});




module.exports = router;
