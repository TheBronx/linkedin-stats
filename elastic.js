'use strict';

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://user:password@elastic-cluster-hostname:9243/',
  log: 'error'
});

async function insertMessage(message, callback) {
  return client.index({
    index: 'linkedin',
    type: 'message',
    body: message
  });
}

module.exports = {
  insertMessage: insertMessage
};
