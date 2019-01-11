const User = require('./userSeeder');
const Room = require('./roomSeeder');
const Review = require('./reviewSeeder');

Room.generateRoomDocuments(10000000, () => {
  User.generateUserDocuments(5000000, () => {
    Review.generateReviewDocuments(30000000);
  })
});