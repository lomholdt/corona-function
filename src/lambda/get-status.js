'use strict';

const cheerio = require('cheerio');
const request = require('request');


export function handler(event, context, callback) {
  request('https://www.sst.dk/da/Viden/Smitsomme-sygdomme/Smitsomme-sygdomme-A-AA/Coronavirus/Spoergsmaal-og-svar/', function(err, response, body){
    if(!err && response.statusCode === 200){
      const $ = cheerio.load(body);

      const tested = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(2)');
      const infected = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(3)');
      const deaths = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(4)');
      const updatedAt = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > p:nth-child(6) > em > em')

      return callback(null, {
          statusCode: 200,
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            tested: tested,
            infected: infected,
            deaths: deaths,
            updatedAt: new Date(updatedAt.text().replace('Opdateret ', ''))
          })
        })
      } else {
        return callback(null, {
          statusCode: 404,
          body: err
        })
      }
    })
}
