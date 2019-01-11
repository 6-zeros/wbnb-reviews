const faker = require('faker');
const fs = require('fs');

const quantity = 10000000; //10 mil

const generateRandomNumber = (min, max) => {
  let randomNumber = Math.round(Math.random() * max);
  if (randomNumber < min) {
    randomNumber = Math.round(Math.random() * max);
  }
  return randomNumber;
};

const generateRoom = index => {
  var room = {
    room_id: index,
    name: `room${index}`,
  }
  return room;
}

const writeData = function(qty, callback) {
  let count = 1;
  qty += 1;
  const stream = fs.createWriteStream(`./CSVDATA/Rooms.txt`, {'flags': 'a'});
  function write(qty, count) {
    var ok = true;
    do {
      qty -= 1;
      if (qty === 1) {
        var data = JSON.stringify(generateRoom(count));
        count++;
        stream.write(data, 'utf8', callback);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        var data = JSON.stringify(generateRoom(count));
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

const generateRoomDocument = function(qty) {
  console.time();
  writeData(qty, () => {
    console.timeEnd();
  });
}

generateRoomDocument(quantity);