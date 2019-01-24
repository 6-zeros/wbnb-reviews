const { Pool } = require('pg');
const { PG_PASSWORD } = require('./keys.js');

const pool = new Pool({
  user: 'joshslee',
  host: '13.57.41.44',
  database: 'wbnb',
  port: 5432,
  password: PG_PASSWORD
});
a
pool.connect(err => {
  if (err) throw err;
  console.log('Postgres connected')
})

module.exports = {
  getReviewByRoomId: function(roomId, callback) {
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack);
      }
      const query = 'SELECT * FROM reviews INNER JOIN users ON users.user_id = reviews.user_id WHERE reviews.room_id = $1';
      const value = [roomId];
      client.query(query, value, (err, res) => {
        release();
        callback(err, res);
      })
    })
  },
  postReview: function(roomid, review, callback) {
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack);
      }
      const { user_id, relevance, datestayed, accuracy, communication, cleanliness, location, checkin, value, body} = review;
      const query = 'INSERT INTO reviews VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';
      const values = [user_id, roomid, relevance, datestayed, accuracy, communication, cleanliness, location, checkin, value, body]; // array of 12
 
      client.query(query, values, (error, res) => {
        release();
        callback(error, res);
      })
    })
  },
  updateReviewById: function(review, callback) {
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack);
      }
      const { body, review_id } = review;
      const query = 'UPDATE reviews SET body = $1 WHERE review_id = $2';
      const values = [body, review_id];
      client.query(query, values, (err, res) => {
        release();
        callback(err, res);
      })
    })
  },
  deleteReviewById: function(reviewId, callback) {
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack);
      }
      const query = 'DELETE FROM reviews WHERE review_id = $1';
      const value = [reviewId];
      client.query(query, value, (err, res) => {
        release();
        callback(err, res);
      })
    })
  }
}