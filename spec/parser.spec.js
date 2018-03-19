'use strict';

const parser = require('../parser');

describe("Messages parser", function() {
  it("should parse dates with AM time", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 8:46 AM',
      'A subject',
      'A message content with €40k and also 45.000 too!',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.date.getTime()).toBe(new Date('2017-11-30T08:46:00').getTime());
  });

  it("should parse dates with PM time", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 8:46 PM',
      'A subject',
      'A message content with €40k and also 45.000 too!',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.date.getTime()).toBe(new Date('2017-11-30T20:46:00').getTime());
  });

  it("should fill minSalary", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 8:46 PM',
      'A subject',
      'A message content with €40k and also 45.000 too!',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.minSalary).toBe(40000);
  });

  it("should fill maxSalary", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 8:46 PM',
      'A subject',
      'A message content with €40k and also 45.000 too!',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.maxSalary).toBe(45000);
  });

  it("should fill min and max salary when in range like XX-YY", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 8:46 PM',
      'A subject',
      'A message content with 40-45k',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.minSalary).toBe(45000); // try to improve this in the future
    expect(message.maxSalary).toBe(45000);
  });
});
