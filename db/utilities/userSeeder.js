const faker = require('faker');
const fs = require('fs');

const quantity = 500000; // total = 2 x quantity
// will generate two files

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
  let user = {
    user_id: index,
    name: faker.name.findName(),
    userAvatar: avatars[generateRandomNumber(0, 10)]
  }
  console.log(index);
  callback(user);
}

const storage = {
  count: 1,
  fileCount: 0,
  updateFileCount: function() {
    this.fileCount;
  },
  updateCounter: function() {
    this.count++;
  },
  getCount: function() {
    return this.count;
  },
  getFileName: function() {
    this.fileCount++;
    return this.fileCount;
  }
}

const updateFileCount = storage.updateFileCount.bind(storage);
const getFileName = storage.getFileName.bind(storage);
const updateCounter = storage.updateCounter.bind(storage);
const getCount = storage.getCount.bind(storage);

const writeData = function(qty, callback) {
  const stream = fs.createWriteStream(`./CSVDATA/Users${getFileName()}.txt`, {'flags': 'a'});
  function write(qty) {
    var ok = true;
    do {
      qty -= 1;
      if (qty === 1) {
        generateUser(getCount(), (user) => {
          updateCounter();
          stream.write(JSON.stringify(user), 'utf8', callback);
        });
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        generateUser(getCount(), (user) => {
          updateCounter();
          ok = stream.write(JSON.stringify(user), 'utf8');
        });
      }
    } while (qty > 0 && ok);
    if (qty > 1) {
      // had to stop early!
      // write some more once it drains
      // console.log('drain');
      stream.once('drain', () => {
        write(qty);
      });
    }
  }
  write(qty);
}

// const delay = function(ms) {
//   var cur_d = new Date();
//   var cur_ticks = cur_d.getTime();
//   var ms_passed = 0;
//   while(ms_passed < ms) {
//       var d = new Date();  // Possible memory leak?
//       var ticks = d.getTime();
//       ms_passed = ticks - cur_ticks;
//       // d = null;  // Prevent memory leak?
//   }
// }

const generateUserDocuments = function(qty) {
  console.time();
  writeData(qty, () => {
    writeData(qty, () => {
      console.timeEnd();
    })
  });
}

generateUserDocuments(quantity);
