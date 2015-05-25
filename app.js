var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var eventproxy = require('eventproxy');

var app = express();

app.listen(process.env.PORT || 5000);

var cnodeUrl = "https://www.cnodejs.org";
app.get('/', function (req, res, next) {
  superagent.get(cnodeUrl)
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }

      var topicUrls = [];
      var $ = cheerio.load(sres.text);
      $('a.topic_title').each(function (i, element) {
        topicUrls.push(cnodeUrl + $(element).attr('href'));
      });

      var ep = new eventproxy();

      topicUrls.forEach(function (topicUrl) {
        superagent.get(topicUrl)
          .end(function (err, sres) {
            ep.emit('topic_html', [topicUrl, sres.text]);
          });
      });

      ep.after("topic_html", topicUrls.length, function (topics) {
        topics = topics.map(function (topicPair) {
          var topicUrl = topicPair[0];
          var topicHtml = topicPair[1];
          var $ = cheerio.load(topicHtml);
          return ({
            title : $('.topic_full_title').text().trim(),
            href : topicUrl,
            comment1: $('.reply_content').eq(0).text().trim(),
          });
        });
        res.send(topics);
      });
  });
});
module.exports = app;