const faker = require('faker');
const fs = require('fs');

const quantity = 1000; //10 million

const generateRoom = (index, callback) => {
  let room = (index === 1) ? `room_id, name\n${index},room${index}` : `\n${index},room${index}`;
  callback(room);
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

const writeData = function(qty, callback) {
  const stream = fs.createWriteStream(`./CSVDATA/Rooms${getFileName()}.csv`, {'flags': 'a'});
  function write(qty) {
    var ok = true;
    do {
      qty -= 1;
      if (qty === 1) {
        generateRoom(getCount(), room => {
          stream.write(room, 'utf8', callback(stream));
        });
      } else {
        generateRoom(getCount(), room => {
          ok = stream.write(room, 'utf8');
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

const generateRoomDocuments = function(qty) {
  console.time();
  writeData(qty, () => {
    console.timeEnd();
  });
}

module.exports = {generateRoomDocuments};