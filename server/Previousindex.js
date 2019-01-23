const express = require('express');
const bodyParser = require('body-parser');
const query = require('../db/querys.js');

const app = express();
const port = 3124;

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/rooms/:roomid', express.static('./public/dist'));

app.get('/api/reviews/rooms/:roomid/', (req, res) => {
  const { roomid } = req.params;
  const { page } = req.query;
  const { search } = req.query;
  const { sortby } = req.query || 'relevant';

  query
    .getAllReviews(roomid)
    .then(allReviews =>
      sortby === 'relevant' || sortby === undefined
        ? query.sortByRelevant(allReviews)
        : query.sortByRecent(allReviews)
    )
    .then(sortedReviews => query.getBySearchTerm(sortedReviews, search))
    .then(sortedReviews => query.getPage(page, sortedReviews))
    .then(pageOfReviews => res.send(pageOfReviews))
    .catch(err => {
      if (err) {
        throw err;
      }
    });
});

app.get('/api/ratings/rooms/:roomid', (req, res) => {
  const { roomid } = req.params;
  query
    .getAllReviews(roomid)
    .then(allReviews => res.send(query.calculateAverageRating(allReviews)))
    .catch(err => {
      if (err) {
        throw err;
      }
    });
});

app.listen(port, () => console.log(`Listening on ${port}`));
