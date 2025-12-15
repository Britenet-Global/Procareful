import fs from 'fs';

const enData = fs.readFileSync('en.json');
const enTranslations = JSON.parse(enData).translations;

const translations = {};

for (const key in enTranslations) {
  translations[key] = '';
}

fs.writeFileSync('si.json', JSON.stringify({ translations }, null, 2));
fs.writeFileSync('de.json', JSON.stringify({ translations }, null, 2));
fs.writeFileSync('hr.json', JSON.stringify({ translations }, null, 2));
fs.writeFileSync('hu.json', JSON.stringify({ translations }, null, 2));
fs.writeFileSync('it.json', JSON.stringify({ translations }, null, 2));
fs.writeFileSync('pl.json', JSON.stringify({ translations }, null, 2));
