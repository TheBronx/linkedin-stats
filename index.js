'use strict';

const POUNDS_TO_EUROS = 1.12;
const DOLLARS_TO_EUROS = 0.81;

const fs = require('fs');
const csvParse = require('csv-parse');
const transform = require('stream-transform');

const LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

const elastic = require('./elastic');

function dayOfWeek(message) {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  message.dayOfWeek = days[message.date.getDay()];

  return message;
}

function parseDate(dateStr) {
  // format: 2/21/18, 6:06 AM
  var dateParts = dateStr.split(',');
  var dayParts = dateParts[0].split('/');
  var d = new Date();
  d.setDate(parseInt(dayParts[1], 10));
  d.setMonth(parseInt(dayParts[0], 10) - 1);
  d.setFullYear(2000 + parseInt(dayParts[2], 10));
  return d;
}

function min(salary) {
  var min = salary[0];

  salary.forEach(s => {
    if (s<min) min = s;
  });

  return min;
}

function max(salary) {
  var max = salary[0];

  salary.forEach(s => {
    if (s>max) max = s;
  });

  return max;
}

function addSalary(message) {
  var matches = message.content.match(/(€?£?\$?\s?\d+[\.\,]?0{3,5}\s?€?£?\$?)/g);
  var matchesK = message.content.match(/(€?£?\$?\s?\d+?[\-\s]?\d+k)/g)
  if (matches || matchesK) {
    if (!matches) matches = [];
    if (!matchesK) matchesK = [];

    message.salary = matches.concat(matchesK).join(', ');

    var pounds = matches.concat(matchesK).join(',').indexOf('£') != -1;
    var dollars = matches.concat(matchesK).join(',').indexOf('$') != -1;

    var salary = matches.concat(matchesK).map(match => {
      var parsed = match.trim().replace(/[\,\.\s]/g, '').replace(/k/, '000');

      //en el caso de un match tipo 25-30k nos quedamos con el 30k
      //ya, no es lo más preciso, pero estamos dentro de un map()
      //convertir este elento en dos (el 25 y el 30) no es trivial. para la v2
      parsed = parsed.replace(/\d\d[\-\s]+/, '');

      if (parsed.indexOf('€') != -1) {
        parsed = parseInt(parsed.replace('€', ''), 10);
      } else if (parsed.indexOf('£') != -1) {
        parsed = parseInt(parsed.replace('£', ''), 10);
        parsed = parsed * POUNDS_TO_EUROS;
      } else if (parsed.indexOf('$') != -1) {
        parsed = parseInt(parsed.replace('$', ''), 10);
        parsed = parsed * DOLLARS_TO_EUROS;
      } else {
        parsed = parseInt(parsed, 10);
        if (pounds) parsed = parsed * POUNDS_TO_EUROS;
        else if (dollars) parsed = parsed * DOLLARS_TO_EUROS;
      }

      return parsed;
    });

    salary = salary.filter(s => { return s > 10000; });

    if (salary.length > 0) {
      message.minSalary = Math.round(min(salary));
      message.maxSalary = Math.round(max(salary));
    }
  }
  return message;
}

function englishOrSpanish(languages) {
  var english = 0;
  var spanish = 0;
  languages.forEach(lang => {
    if (lang[0] == 'english') {
      english = lang[1];
    } else if (lang[0] == 'spanish') {
      spanish = lang[1];
    }
  });

  return (english > spanish) ? 'english' : 'spanish';
}

function detectLanguage(message) {
  var languages = lngDetector.detect(message.content);
  message.language = englishOrSpanish(languages);
  return message;
}

function parse(file) {
  var parser = csvParse({delimiter: ','});
  var input = fs.createReadStream(file);

  var transformer = transform(function(record, callback){
    var message = {
      'from': record[0],
      'to': record[1],
      'date': parseDate(record[2]),
      'subject': record[3],
      'content': record[4],
      'direction': record[5],
      'folder': record[6]
    };

    message = dayOfWeek(message);
    message = detectLanguage(message);

    if (message.direction == 'INCOMING') {
      message = addSalary(message);
    } else {
      //callback(null, '');
    }

    elastic.insertMessage(message, function() {
      console.log(message.date.toString());
      callback(null, '');
    });

  }, {parallel: 1});

  input.pipe(parser).pipe(transformer).pipe(process.stdout); //si quito el stdout no consume todo el stream
  transformer.on('finish', function() {
    console.log('finished');
  });

}

parse('messages.csv');
