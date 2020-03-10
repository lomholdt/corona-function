'use strict'

const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function(event, context) {
  try {
    const response = await fetch('https://www.sst.dk/da/Viden/Smitsomme-sygdomme/Smitsomme-sygdomme-A-AA/Coronavirus/Spoergsmaal-og-svar/', {
      headers: { Accept: 'text/html' }
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.text()
    const $ = cheerio.load(data);

    const tested = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(2)');
    const infected = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(3)');
    const deaths = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(4)');
    const updatedAt = $('body > div.main__content > main > article > div.o-content-block.u-grid.u-grid--space-between.u-grid--no-gutter.u-ie > div > div:nth-child(6) > p:nth-child(6) > em > em');

    return {
      statusCode: 200,
      body: JSON.stringify({
        tested: tested.text(),
        infected: infected.text(),
        deaths: deaths.text(),
        updatedAt: new Date(updatedAt.text().replace('Opdateret ', ''))
      })
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
