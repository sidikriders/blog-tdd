var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artikelSchema = mongoose.Schema({
    title: String,
    isi: String,
    user_id: {
       type: Schema.Types.ObjectId,
       ref: 'User'
     },
    createdAt: Date,
    updatedAt: Date
});

var Artikel = mongoose.model('Artikel', artikelSchema);

module.exports = Artikel;
