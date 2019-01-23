const faker = require('faker');
const fs = require('fs');

const quantity = 5000000; //5000000

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

const generateRandomNumber = (min, max) => {
  let randomNumber = Math.round(Math.random() * max);
  if (randomNumber < min) {
    randomNumber = Math.round(Math.random() * max);
  }
  return randomNumber;
};

const generateUser = (index, callback) => {
  let user = (index === 1) 
    ? `user_id,name,userAvatar\n${index},${faker.name.findName()},${avatars[generateRandomNumber(0, 10)]}`
    : `\n${index},${faker.name.findName()},${avatars[generateRandomNumber(0, 10)]}`;
  callback(user);
}

const countKeeper = {
  count: 0,
  fileCount: 0,
  getCount: function() {
    this.count++;
    return this.count;
  },
  getFileName: function() {
    this.fileCount++;
    return this.fileCount;
  }
}

const getFileName = countKeeper.getFileName.bind(countKeeper);
const getCount = countKeeper.getCount.bind(countKeeper);

const writeUserData = function(qty, callback) {
  const stream = fs.createWriteStream(`./CSVDATA/Users${getFileName()}.csv`, {'flags': 'a'});
  function write(qty) {
    var ok = true;
    do {
      qty -= 1;
      if (qty === 1) {
        generateUser(getCount(), (user) => {
          stream.write(user, 'utf8', callback(stream));
        });
      } else {
        generateUser(getCount(), (user) => {
          ok = stream.write(user, 'utf8');
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

const generateUserDocuments = function(qty) {
  console.time();
  writeUserData(qty, () => {
    console.timeEnd();
  });
}

generateUserDocuments(quantity);
module.exports = {generateUserDocuments};