'use strict';

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://user:password@elastic-cluster-hostname:9243/',
  log: 'error'
});

function insertMessage(message, callback) {
  client.index({
    index: 'linkedin',
    type: 'message',
    body: message
  },function(err,resp,status) {
      if (err) console.log(err);

      callback(err);
  });
}

module.exports = {
  insertMessage: insertMessage
};;
