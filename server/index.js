const nr = require('newrelic');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
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
  getReviewByRoomId(roomid, (err, response) => {
    if (err) {
      res.status(500).send();
    } else {
      let { rows } = response;
      sortReviews(rows, req)
      .then(reviews => res.send(reviews));
    }
  })
});

app.get('/api/ratings/rooms/:roomid', (req, res) => {
  const { roomid } = req.params;
  getReviewByRoomId(roomid, (err, response) => {
    if (err) {
      res.status(500).send();
    } else {
      let { rows } = response;
      res.send(calculateAverageRating(rows));
    }
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
