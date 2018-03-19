'use strict';

const Conversations = require('../Conversations');

describe("Conversations", function() {
  it("should return an incoming message without an answer", function() {
    var conversations = new Conversations();

    conversations.addMessage({
      'direction': 'INCOMING',
      'from': 'Bill Gates',
      'to': 'Salva',
      'date': new Date('2018-03-18T00:00:00')
    });

    var messages = conversations.getConversationWith('Bill Gates');

    expect(messages.length).toBe(1);
    expect(messages[0].answered).toBe(false);
  });

  it("should return an incoming that was answered", function() {
    var conversations = new Conversations();

    conversations.addMessage({
      'direction': 'INCOMING',
      'from': 'Bill Gates',
      'to': 'Salva',
      'content': 'Wanna work for Microsoft?',
      'date': new Date('2018-03-18T00:00:00')
    });

    conversations.addMessage({
      'direction': 'OUTGOING',
      'from': 'Salva',
      'to': 'Bill Gates',
      'content': 'Nah thanks :)',
      'date': new Date('2018-03-18T11:11:11')
    });

    var messages = conversations.getConversationWith('Bill Gates');

    expect(messages.length).toBe(2);
    expect(messages[0].answered).toBe(true);
  });

  it("should return two incoming messages that got no answer", function() {
    var conversations = new Conversations();

    conversations.addMessage({
      'direction': 'INCOMING',
      'from': 'Bill Gates',
      'to': 'Salva',
      'content': 'Wanna work for Microsoft?',
      'date': new Date('2018-03-18T00:00:00')
    });

    conversations.addMessage({
      'direction': 'INCOMING',
      'from': 'Bill Gates',
      'to': 'Salva',
      'content': 'We love open source!',
      'date': new Date('2018-03-18T00:33:00')
    });

    var messages = conversations.getConversationWith('Bill Gates');

    expect(messages.length).toBe(2);
    expect(messages[0].answered).toBe(false);
    expect(messages[1].answered).toBe(false);
  });

  it("should return two incoming messages, the second one got an answer", function() {
    var conversations = new Conversations();

    conversations.addMessage({
      'direction': 'INCOMING',
      'from': 'Bill Gates',
      'to': 'Salva',
      'content': 'Wanna work for Microsoft?',
      'date': new Date('2018-03-18T00:00:00')
    });

    conversations.addMessage({
      'direction': 'INCOMING',
      'from': 'Bill Gates',
      'to': 'Salva',
      'content': 'We love open source!',
      'date': new Date('2018-03-18T00:33:00')
    });

    conversations.addMessage({
      'direction': 'OUTGOING',
      'from': 'Salva',
      'to': 'Bill Gates',
      'content': 'Nah thanks :)',
      'date': new Date('2018-03-18T11:11:11')
    });

    var messages = conversations.getConversationWith('Bill Gates');

    expect(messages.length).toBe(3);
    expect(messages[0].answered).toBe(false);
    expect(messages[1].answered).toBe(true);
  });
});
