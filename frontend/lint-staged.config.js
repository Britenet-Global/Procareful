module.exports = {
  '{apps,libs}/**/*.{ts,tsx}': files => {
    const filteredFiles = files.filter(
      file => !file.includes('services.ts') && !file.includes('services.schemas.ts')
    );
    if (filteredFiles.length) {
      console.log('Files:\n' + filteredFiles.join('\n'));
      return `nx affected:lint --fix --files=${filteredFiles.join(',')}`;
    }
    return [];
  },
  '{apps,libs}/**/*.{js,ts,jsx,tsx,json}': [
    files => {
      const filteredFiles = files.filter(
        file => !file.includes('services.ts') && !file.includes('services.schemas.ts')
      );
      if (filteredFiles.length) {
        console.log('Files:\n' + filteredFiles.join('\n'));
        return `nx affected:lint --fix --files=${filteredFiles.join(',')}`;
      }
      return [];
    },
    'npm run prettier:fix',
  ],
  '{libs/common/src/i18n/translations/*.json}': [
    'npm run update-dicts',
    'npm run sort',
    'git add .',
  ],
};
