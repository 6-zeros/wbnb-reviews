const faker = require('faker');
const fs = require('fs');

const quantity = 10000000 //30 mil
// const quantity = 1000;

const generateRandomNumber = (min, max) => {
  let randomNumber = Math.round(Math.random() * max);
  if (randomNumber < min) {
    randomNumber = Math.round(Math.random() * max);
  }
  return randomNumber;
};

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

const generateReview = index => {
  var review = {
    user_id: generateRandomNumber(1, 2000000),
    room_id: generateRandomNumber(1, 10000000),
    relevance: generateRandomNumber(1, 10),
    dateStayed: `${months[generateRandomNumber(0, 11)]} ${years[generateRandomNumber(0, 8)]}`,
    accuracy: generateRandomNumber(1, 5),
    communication: generateRandomNumber(1, 5),
    cleanliness: generateRandomNumber(1, 5),
    location: generateRandomNumber(1, 5),
    checkin: generateRandomNumber(1, 5),
    value: generateRandomNumber(1, 5),
    body: faker.lorem.paragraphs(4),
  }
  console.log(index);
  return review;
}
  
const writeData = function(qty, callback) {
  let count = 1;
  qty += 1;
  const stream = fs.createWriteStream(`./CSVDATA/Reviews.txt`, {'flags': 'a'});
  function write(qty, count) {
    var ok = true;
    do {
      qty -= 1;
      if (qty === 1) {
        var data = JSON.stringify(generateReview(count));
        count++;
        stream.write(data, 'utf8', callback);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        var data = JSON.stringify(generateReview(count));
        count++;
        ok = stream.write(data, 'utf8');
      }
    } while (qty > 1 && ok);
    if (qty > 1) {
      // had to stop early!
      // write some more once it drains
      // console.log('drain');
      stream.once('drain', () => {
        count++;
        write(qty-1, count);
      });
    }
  }
  write(qty, count);
}

const generateReviewDocument = function(qty) {
  console.time();
  writeData(qty, () => {
    console.timeEnd();
  });
}

generateReviewDocument(quantity);