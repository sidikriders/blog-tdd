const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

var server = require('../app')
var User = require("../models/users.js")
var should = chai.should()
var bcrypt = require('bcrypt');
const saltRounds = 10;

describe('artikel', () => {
  var user_id = ''
  beforeEach( () => {
    let newPass = bcrypt.hashSync("bungamerah", saltRounds)
    var newUser = new User({
      "username": "testUser",
      "pass": newPass,
      "full_name": "Testing User"
    })

    newUser.save(() => {
      user_id = newUser._id
    })
  })

  afterEach((done) => {
    User.remove({}, (err) => {
      done()
    })
  })

  describe('POST /signup', () => {
    it('should get response success create', () => {

      chai.request(server)
        .post('/signup') // methodnya bisa get atau post atau yg lainnya
        .send({
          newUser: "testSignUp",
          newPass: "TestSignUp",
          newFullName: "Test Sign Up"
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.text.should.equal('berhasil daftar, login gih')
      })
    })
  })

  describe('POST /login', () => {
    it('should get response success login', () => {

      chai.request(server)
        .post('/login') // methodnya bisa get atau post atau yg lainnya
        .send({
          currUser: "testUser",
          currPass: "bungamerah"
        })
        .end((err, res) => {
          console.log(res.text);
          res.should.have.status(200)
          res.text.should.equal('anda berhasil log in!')
      })
    })
  })

  describe('GET /logout', () => {
    it('should get response success logout', () => {

      chai.request(server)
        .get('/logout') // methodnya bisa get atau post atau yg lainnya
        .end((err, res) => {
          console.log(res.text);
          res.should.have.status(200)
          res.text.should.equal('anda sudah berhasil logout')
      })
    })
  })

})
