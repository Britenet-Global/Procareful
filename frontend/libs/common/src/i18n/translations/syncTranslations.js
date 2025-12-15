import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderPath = path.resolve(__dirname);
const masterFile = 'en.json';

const loadJsonFile = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const saveJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const synchronizeTranslations = (folderPath, masterFile) => {
  const masterFilePath = path.join(folderPath, masterFile);
  const masterData = loadJsonFile(masterFilePath);
  const masterKeys = new Set(Object.keys(masterData.translations));

  fs.readdirSync(folderPath).forEach(file => {
    if (file !== masterFile && path.extname(file) === '.json') {
      const filePath = path.join(folderPath, file);
      const fileData = loadJsonFile(filePath);

      masterKeys.forEach(key => {
        if (!(key in fileData.translations)) {
          fileData.translations[key] = '';
        }
      });

      Object.keys(fileData.translations).forEach(key => {
        if (!masterKeys.has(key)) {
          delete fileData.translations[key];
        }
      });

      saveJsonFile(filePath, fileData);
      console.log(`${file} has been updated`);
    }
  });
};

synchronizeTranslations(folderPath, masterFile);
