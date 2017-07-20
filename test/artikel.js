const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

var server = require('../app')
var Artikel = require("../models/artikel.js")
var should = chai.should()

describe('artikel', () => {
  var artikel_id = ''
  beforeEach(done => {
    var newArtikel = new Artikel({
      "isi": "sdmlkasjdj",
      "title": "bunga merah"
    })

    newArtikel.save(() => {
      artikel_id = newArtikel._id
      done()
    })
  })

  afterEach((done) => {
    Artikel.remove({}, (err) => {
      done()
    })
  })

  describe('GET /artikel', () => {
    it('should get all artikel', done => {

      chai.request(server)
        .get('/artikel') // methodnya bisa get atau post atau yg lainnya
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.equal(0)

          done()
      })
    })
  })

  describe('POST /artikel', () => {
    it('should create new artikel', done => {

      chai.request(server)
      .post('/artikel')
      .send({
        newTitle: "test1",
        newIsi: "ini isi test1",
        user_id: 'some user id',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('title')
        res.body.should.have.property('isi')
        res.body.should.have.property('user_id')
        res.body.should.have.property('createdAt')
        res.body.should.have.property('updatedAt')
        res.body.should.have.property('updatedAt')

        done()
      })
    })
  })

  describe('PUT /artikel', () => {
    it('should UPDATE some article', done => {

      chai.request(server)
      .put('/artikel')
      .send({
        id: artikel_id,
        newTitle: "ini title ter update",
        newIsi: "ini isi yang telah terupdate"
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.text.should.be.a('string')
        done()
      })
    })
  })

  describe('DELETE /artikel', () => {
    it('should DELETE some article', done => {

      chai.request(server)
      .delete('/artikel')
      .send({
        id: artikel_id
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.not.have.property('title')
        res.body.should.not.have.property('isi')
        res.body.should.not.have.property('user_id')
        res.body.should.not.have.property('createdAt')
        res.body.should.not.have.property('updatedAt')
        res.body.should.not.have.property('updatedAt')
        done()
      })
    })
  })

  describe('GET /artikel/:username', () => {
    it('should GET some article', () => {

      chai.request(server)
      .get('/artikel/:username')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
      })
    })
  })
})
