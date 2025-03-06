const fs = require('fs');
const path = require('path');

const characters = {
  'シェリー': 'shelly',
  'ニタ': 'nita',
  'コルト': 'colt',
  'ブル': 'bull',
  'ブロック': 'brock',
  'エルプリモ': 'elPrimo',
  'バーリー': 'barley',
  'ポコ': 'poco',
  'ローサ': 'rosa',
  'ジェシー': 'jessie',
  'ダイナマイク': 'dynamike',
  'ティック': 'tick',
  '8ビット': 'eightBit',
  'リコ': 'rico',
  'ダリル': 'darryl',
  'ペニー': 'penny',
  'カール': 'carl',
  'ジャッキー': 'jacky',
  'ガス': 'gus',
  'ボウ': 'bo',
  'Emz': 'emz',
  'ストゥー': 'stu',
  'エリザベス': 'piper',
  'パム': 'pam',
  'フランケン': 'frank',
  'ビビ': 'bibi',
  'ビー': 'bea',
  'ナーニ': 'nani',
  'エドガー': 'edgar',
  'グリフ': 'griff',
  'グロム': 'grom',
  'ボニー': 'bonnie',
  'ゲイル': 'gale',
  'コレット': 'colette',
  'ベル': 'belle',
  'アッシュ': 'ash',
  'ローラ': 'lola',
  'サム': 'sam',
  'マンディ': 'mandy',
  'メイジー': 'maisie',
  'ハンク': 'hank',
  'パール': 'pearl',
  'ラリー&ローリー': 'larryandLawrie',
  'アンジェロ': 'angelo',
  'ベリー': 'berry',
  'シェイド': 'shade',
  'モーティス': 'mortis',
  'タラ': 'tara',
  'ジーン': 'gene',
  'MAX': 'max',
  'ミスターP': 'mrp',
  'スプラウト': 'sprout',
  'バイロン': 'byron',
  'スクウィーク': 'squeak',
  'ルー': 'lou',
  'ラフス': 'ruffs',
  'バズ': 'buzz',
  'ファング': 'fang',
  'イヴ': 'eve',
  'ジャネット': 'janet',
  'オーティス': 'otis',
  'バスター': 'buster',
  'グレイ': 'gray',
  'R-T': 'rt',
  'ウィロー': 'willow',
  'ダグ': 'doug',
  'チャック': 'chuck',
  'チャーリー': 'charlie',
  'ミコ': 'mico',
  'メロディー': 'melodie',
  'リリー': 'lily',
  'クランシー': 'clancy',
  'モー': 'moe',
  'ジュジュ': 'juju',
  'スパイク': 'spike',
  'クロウ': 'crow',
  'レオン': 'leon',
  'サンディ': 'sandy',
  'アンバー': 'amber',
  'メグ': 'meg',
  'サージ': 'surge',
  'チェスター': 'chester',
  'コーデリアス': 'cordelius',
  'キット': 'kit',
  'ドラコ': 'draco',
  'ケンジ': 'kenji',
  'フィンクス': 'finx',
};

const outputDir = path.join(__dirname, 'data', 'characters');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let nextId = 1;

for (const [jaName, enName] of Object.entries(characters)) {
  const compatibilityScores = {};
  
  for (const [otherJaName] of Object.entries(characters)) {
    if (otherJaName !== jaName) {
      compatibilityScores[otherJaName] = 0;
    }
  }

  const characterData = `import { CharacterCompatibility } from '../types/types';

export const ${enName}Data: CharacterCompatibility = {
  "id": ${nextId},
  "name": "${jaName}",
  "compatibilityScores": ${JSON.stringify(compatibilityScores, null, 2)},
  "explanation": {}
};
`;

  const filePath = path.join(outputDir, `${enName}Data.ts`);
  fs.writeFileSync(filePath, characterData);
  console.log(`Created: ${filePath}`);
  
  nextId++;
}

console.log('\nAll character data files have been generated successfully!');
