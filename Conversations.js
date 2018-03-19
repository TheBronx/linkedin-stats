'use strict';

var Conversation = function() {
  this.messagesByUser = {};
};

Conversation.prototype.addMessage = function(message) {
  var conversationWith = (message.direction === 'INCOMING') ? message.from : message.to;

  var messages = this.messagesByUser[conversationWith];
  if (!messages) {
    messages = [message];
  } else {
    messages.push(message);
    messages = messages.sort(function(a, b) {
      return a.date.getTime() - b.date.getTime();
    });
  }

  this.messagesByUser[conversationWith] = messages;
}

Conversation.prototype.getConversationWith = function(user) {
  var messages = this.messagesByUser[user];

  for (var i=0; i<messages.length; i++) {
    var message = messages[i];
    if (message.direction === 'INCOMING') {
      if (i !== messages.length-1) {
        message.answered = messages[i + 1].direction !== 'INCOMING';
      } else {
        message.answered = false;
      }
    }
  }

  return messages;
}

Conversation.prototype.getAllMessages = function() {
  var _this = this;

  var messages = [];

  Object.keys(this.messagesByUser).forEach(function (user) {
    messages = messages.concat(_this.getConversationWith(user));
  });

  return messages;
}

module.exports = Conversation;
