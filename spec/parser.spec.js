'use strict';

const parser = require('../parser');

const LINKEDIN_HOUR_OFFSET_CORRECTION = -15; //I am in GMT+1, linkedin dates are GMT+16

describe("Messages parser", function() {
  it("should parse dates with AM time and adjust offset", function() {
    var csvRecord = [
      'from',
      'to',
      '2/23/18, 5:19 AM',
      'A subject',
      'A message content with €40k and also 45.000 too!',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.date.getTime()).toBe(new Date('2018-02-22T14:19:00').getTime());
  });

  it("should parse dates with PM time", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 3:46 PM',
      'A subject',
      'A message content with €40k and also 45.000 too!',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.date.getTime()).toBe(new Date('2017-11-30T00:46:00').getTime());
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

  it("should fill hour of day (AM)", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 10:46 AM',
      'A subject',
      'A message content with 40-45k',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.hourOfDay).toBe(24 + (10 + LINKEDIN_HOUR_OFFSET_CORRECTION));
  });

  it("should fill hour of day (PM)", function() {
    var csvRecord = [
      'from',
      'to',
      '11/30/17, 10:46 PM',
      'A subject',
      'A message content with 40-45k',
      'INCOMING',
      'INBOX'
    ];

    var message = parser.parse(csvRecord);

    expect(message.hourOfDay).toBe(22 + LINKEDIN_HOUR_OFFSET_CORRECTION);
  });
});
