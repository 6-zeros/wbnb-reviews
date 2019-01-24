const nr = require('newrelic');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { redis_get, redis_set } = require('../db/redis.js');
const { sortReviews, calculateAverageRating } = require('../db/helpers.js');
const { getReviewByRoomId, postReview, updateReviewById, deleteReviewById } = require('../db/controllers.js');
const app = express();
const port = 3124;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/rooms/:roomid', express.static('./public/dist'));

app.get('/api/reviews/rooms/:roomid/', (req, res) => {
  const { roomid } = req.params;
  redis_get(roomid)
  .then(result => {
    if (result === null) {
      getReviewByRoomId(roomid, (err, response) => {
        if (err) {
          res.status(500).send();
        } else {
          let { rows } = response;
          sortReviews(rows, req)
          .then(reviews => {
            redis_set(roomid, JSON.stringify(reviews), 'EX', 20);
            // redis_set(roomid, JSON.stringify(reviews));
            res.send(reviews);
          })
        }
      })
    } else {
      redis_set(roomid, JSON.stringify(reviews), 'EX', 15);
      res.status(300).send(JSON.parse(result));
    }
  })
  .catch((error) => {
    res.status(500).send();
  })
});

app.get('/api/ratings/rooms/:roomid', (req, res) => {
  const { roomid } = req.params;
  redis_get(`ratings${roomid}`)
  .then(result => {
    if (result === null) {
      getReviewByRoomId(roomid, (err, response) => {
        if (err) {
          res.status(500).send();
        } else {
          let { rows } = response;
          let avgRatings = calculateAverageRating(rows);
          redis_set(`ratings${roomid}`, JSON.stringify(avgRatings), 'EX', 20);
          res.send(avgRatings);
        }
      })
    } else {
      // redis_set(`ratings${roomid}`, result, 'EX', 20); // refresh timer in redis
      res.status(300).send(JSON.parse(result));
    }
  })
  .catch(error => {
    res.status(500).send();
  })
})

app.post('/api/reviews/rooms/:roomid/', (req, res) => {
  const { roomid } = req.params;
  const review = req.body;
  postReview(roomid, review, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(review);
    }
  })
});

app.put('/api/reviews/rooms/:roomid/', (req, res) => {
  const updatedReview = req.body;
  updateReviewById(updatedReview, (err, response) => {
    if (err) {
      res.status(204).send();
    } else {
      res.status(200).send(updatedReview);
    }
  })
});

app.delete('/api/reviews/rooms/:roomid', (req, res) => {
  const { roomid } = req.params;
  deleteReviewById(roomid, (err, response) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(200).send('File deleted');
    }
  })
});

app.listen(port, () => console.log(`Listening on ${port}`));


// if (err) {
//   return callback(err);
// } else {
//   return callback(null, JSON.parse(result));
// }