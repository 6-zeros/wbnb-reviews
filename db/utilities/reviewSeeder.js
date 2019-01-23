const faker = require('faker');
const fs = require('fs');

quantity = 2000; // 30000000

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

const generateReview = (callback)=> {
  // const keys = 'review_id,user_id,room_id,relevance,dateStayed,accuracy,communication,cleanliness,location,checkin,value,body';
  let entry = `\ndefault,${generateRandomNumber(1, 5000000)},${getCount()},${generateRandomNumber(1, 10)},${months[generateRandomNumber(0, 11)]} ${years[generateRandomNumber(0, 8)]},${generateRandomNumber(1, 5)},${generateRandomNumber(1, 5)},${generateRandomNumber(1, 5)},${generateRandomNumber(1, 5)},${generateRandomNumber(1, 5)},${generateRandomNumber(1, 5)},${JSON.stringify(faker.lorem.sentences(generateRandomNumber(1, 3)))}`;
  // let review = countKeeper.newFile ? keys + entry : entry;
  let review = entry;
  countKeeper.newFile = false;
  callback(review);
}

const countKeeper = {
  count: 0,
  fileCount: 0,
  newFile: true,
  getCount: function() {
    this.count++;
    return this.count;
  },
  getFileName: function() {
    this.fileCount++;
    this.newFile = true;
    return this.fileCount;
  }
}
// const getFileName = countKeeper.getFileName.bind(countKeeper);
const getCount = countKeeper.getCount.bind(countKeeper);

const writeData = function(qty, callback) {
  // const stream = fs.createWriteStream(`./CSVDATA/Reviews${getFileName()}.csv`, {'flags': 'a'});
  const stream = fs.createWriteStream(`./csvFiles/ReviewsExtra.csv`, {'flags': 'a'});
  function write(qty) {
    var ok = true;
    do {
      qty -= 1;
      if (qty === 1) {
        generateReview(review => {
          stream.write(review, 'utf8', callback);
        });
      } else {
        generateReview(review => {
          ok = stream.write(review, 'utf8');
        });
      }
    } while (qty > 0 && ok);
    if (qty > 1) {
      stream.once('drain', () => {
        write(qty);
      });
    }
  }
  write(qty);
}

const generateReviewDocuments = function(qty) {
  console.time();
  writeData(qty, () => {
    console.timeEnd();
  });
}

generateReviewDocuments(quantity);
module.exports = {generateReviewDocuments};