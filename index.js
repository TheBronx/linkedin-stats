'use strict';

const fs = require('fs');
const csvParse = require('csv-parse');
const transform = require('stream-transform');
const messageParser = require('./parser');
const Conversations = require('./Conversations');
const elastic = require('./elastic');

var conversations = new Conversations();

function parse(file) {
  var parser = csvParse({delimiter: ','});
  var input = fs.createReadStream(file);

  var transformer = transform(function(record, callback){
    var message = messageParser.parse(record);

    if (message) {
      conversations.addMessage(message);
    }

    callback(null, '');

  }, {parallel: 1});

  input.pipe(parser).pipe(transformer).pipe(process.stdout); //si quito el stdout no consume todo el stream
  transformer.on('finish', async function() {
    var messages = conversations.getAllMessages();

    for (const m of messages) {
      console.log(m.date.toString() + '    ' + m.from + ' >> ' + m.to + '    ' + m.subject + '\n' + m.content.substring(0, 120) + '\n');
      try {
        await elastic.insertMessage(m);
      } catch (err) {
        console.log(err)
      }
    }
  });
}

parse('messages.csv');
