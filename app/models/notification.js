var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema   = new Schema({
    user_id : { type: Number, required: true, index: true },
    title: { type: String, required: true },
    body: String,
    link: String,
    image: String,
});

module.exports = mongoose.model('Notification', NotificationSchema);

