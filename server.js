var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var mongo_url = (process.env.CARTERO_MONGO_URL || 'localhost')
mongoose.connect('mongodb://' + mongo_url + '/cartero');

var Notification = require('./app/models/notification');

app.use(bodyParser.json());

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

app.use('/', router);

router.route('/notifications')
  .get(function(req, res) {
    Notification.find({
      user_id: req.header("x-consumer-custom-id")
    }, function(err, notifications) {
      if (err)
        res.send(err);
      res.json({
        "notifications": notifications.map(function(notification){
          return {
            "notification_id": notification._id,
            "title": notification.title,
            "body": notification.body,
            "link": notification.link,
            "image": notification.image
          }
        })
      });
    });
  });

router.route('/notifications/:notification_id')
  .delete(function(req, res) {
    Notification.remove({
      _id: req.params.notification_id
    }, function(err, notification) {
      if (err)
        res.send(err);
      res.status(204).end();
    });
  });

router.route('/internal/notifications')
  .post(function(req, res) {
    var notification = new Notification();

    notification.user_id = req.body.user_id;
    notification.title = req.body.title;
    notification.body = req.body.body;
    notification.link = req.body.link;
    notification.image = req.body.image;

    notification.save(function(err) {
      if (err)
        res.send(err);
      res.status(204).end();
    });
  })

var port = process.env.CARTERO_PORT || 3000;
app.listen(port);

console.log('listen on port ' + port);
