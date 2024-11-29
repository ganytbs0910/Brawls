import fs from 'fs';
import path from 'path';
import { CharacterCompatibility } from '../types/types';

// [前回のキャラクター定義コードをここに配置]

// ディレクトリ作成関数
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ファイル生成関数
const generateFile = (fileName: string, data: CharacterCompatibility) => {
  const dirPath = path.join(__dirname, '../src/data/characters');
  ensureDirectoryExists(dirPath);
  
  const filePath = path.join(dirPath, `${fileName}.ts`);
  const fileContent = `import { CharacterCompatibility } from '../../types/types';

export const ${fileName}Data: CharacterCompatibility = ${JSON.stringify(data, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Generated: ${filePath}`);
};

// メイン実行関数
const main = () => {
  const allCharacterData = generateAllCharacterData();
  
  Object.entries(allCharacterData).forEach(([fileName, data]) => {
    generateFile(fileName, data);
  });
  
  console.log('Character data generation complete!');
};

main();