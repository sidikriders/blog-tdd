var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
var Artikel = require('../models/artikel');
var User = require('../models/users')
var Storage = require('dom-storage');
var localStorage = new Storage('./db.json', { strict: false, ws: '  ' })
var jwt = require('jsonwebtoken');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/artikel/all', function(req, res, next) {
  Artikel.find({}, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      res.send(response)
    }
  })
})

router.post('/artikel/new', function(req, res, next) {
  Artikel.create({
    title: req.body.newTitle,
    isi: req.body.newIsi,
    user_id: req.body.user_id,
    createdAt: new Date(),
    updatedAt: new Date()
  }, function(err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send(response)
    }
  })
})

router.delete('/artikel/:id', function(req, res, next) {
  Artikel.findByIdAndRemove({
    _id: req.params.id
  }, function(err) {
    if (err) {
      res.send(err)
    } else {
      res.send('terhapus brow!!')
    }
  })
})

router.put('/artikel', function(req, res, next) {
  Artikel.update({
    _id: req.body.id
  }, {
    $set: {
      title: req.body.newTitle,
      isi: req.body.newIsi,
      updatedAt: new Date()
    }
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send('berhasil terupdate')
    }
  })
})

router.get('/artikel/:id', function(req, res, next) {
  Artikel.find({
    user_id: req.params.id
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result)
    }
  })
})



router.post('/signup', function(req,res,next) {
  User.find({
    username: req.body.newUser
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else if (result.length > 0) {
      res.send('sudah ada username kyk gitu tauk!')
    } else {
      var hash = bcrypt.hashSync(req.body.newPass, saltRounds)
      User.create({
        username: req.body.newUser,
        pass: hash,
        full_name: req.body.newFullName
      }, function(err) {
        res.send(err ? err : 'berhasil daftar, login gih')
      })
    }
  })
})

router.post('/login', function(req, res, next) {

  User.findOne({
    username: req.body.currUser
  }, function(err, result){
    if (err) {
      console.log(err);
    } else if (!result) {
      res.send('username tidak di temukan')
    } else {
      console.log(result);
      let check = bcrypt.compareSync(req.body.currPass, result.pass)
      console.log(check);
      if (check === false) {
        res.send('salah password')
      } else {
        let mau = {
          _id: result._id,
          full_name: result.full_name
        }
        let token = jwt.sign(mau, 'testingArtikel')
        res.send(mau)
      }
    }
  })
})

router.get('/token', function(req, res, next) {
  let token = localStorage.getItem('testingArtikel');
  let activeUser = jwt.verify(token, 'testingArtikel');
  res.send(activeUser)
})

router.get('/logout', function(req, res, next) {
  localStorage.clear();
  if (localStorage.getItem('testingArtikel') === null) {
    res.send('anda sudah berhasil logout')
  } else {
    res.send('hmm ada yang salah nih')
  }
})


module.exports = router;
