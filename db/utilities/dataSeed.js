/* eslint-disable prefer-destructuring */
const faker = require('faker');
const mongoose = require('mongoose');
const domain = process.env.DOMAIN || '172.17.0.2';

const db = mongoose.connect(
  `mongodb://${domain}:27017/errbnb`,
  { useNewUrlParser: true }
);
const Schema = mongoose.Schema;

const avatars = [
  'https://a0.muscache.com/im/users/3272332/profile_pic/1366680802/original.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/user/c76d5746-59f9-4af2-b8cb-55fd1bc4c45b.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/user/ce56e7ea-8e11-4307-bd19-047d8d72a707.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/users/45316353/profile_pic/1443546259/original.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/user/e79bbc7c-4592-4d1a-b0bb-59c33af9b180.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/e4140d32-72a1-4bfc-b869-86835c5a1b20.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/a37aad6f-e90d-49c5-abc3-6e58efdf71d6.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/user/f3fbd6b4-f3d8-4ec5-9e15-b99d635a1aa0.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/user/7e8ca207-efc4-40d7-b1c2-278ff1ffc9f6.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/user/bba8cf25-d4a7-4b5a-bf43-04a65c22afdb.jpg?aki_policy=profile_x_medium',
  'https://a0.muscache.com/im/pictures/ac8665ce-e787-4766-b456-eae390613d99.jpg?aki_policy=profile_x_medium'
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const years = ['2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];

const reviewSchema = new Schema({
  roomId: Number,
  relevance: Number,
  name: String,
  userAvatar: String,
  dateStayed: String,
  review: [
    {
      accuracy: Number,
      communication: Number,
      cleanliness: Number,
      location: Number,
      checkin: Number,
      value: Number,
      body: String
    }
  ]
});

const Review = mongoose.model('Review', reviewSchema);

const generateRandomNumber = (min, max) => {
  let randomNumber = Math.round(Math.random() * max);
  if (randomNumber < min) {
    randomNumber = Math.round(Math.random() * max);
  }
  return randomNumber;
};

const generateReviewDocuments = qty => {
  const queue = [];

  for (let i = 0; i < qty; i += 1) {
    const review = new Review({
      roomId: generateRandomNumber(0, 99),
      relevance: generateRandomNumber(1, 10),
      name: faker.name.firstName(),
      userAvatar: avatars[generateRandomNumber(0, 10)],
      dateStayed: `${months[generateRandomNumber(0, 11)]} ${years[generateRandomNumber(0, 8)]}`,
      review: [
        {
          accuracy: generateRandomNumber(1, 5),
          communication: generateRandomNumber(1, 5),
          cleanliness: generateRandomNumber(1, 5),
          location: generateRandomNumber(1, 5),
          checkin: generateRandomNumber(1, 5),
          value: generateRandomNumber(1, 5),
          body: faker.lorem.paragraphs(4)
        }
      ]
    });

    const p = new Promise((resolve, reject) => {
      Review.create(review, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    queue.push(p);
  }

  return Promise.all(queue);
};

const clearDatabase = () =>
  new Promise((resolve, reject) => {
    Review.deleteMany({}, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

clearDatabase()
  .then(() => generateReviewDocuments(10000))
  .then(() => {
    process.exit();
  })
  .catch(err => {
    throw err;
  });
