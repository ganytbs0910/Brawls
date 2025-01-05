import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CHARACTER_IMAGES, isValidCharacterName, CharacterName } from '../data/characterImages';

interface CharacterImageProps {
  characterName: string;
  imageUrl?: string;
  size?: number;
  style?: object;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ characterName, size = 50, style }) => {
  const nameToIdentifier: { [key: string]: CharacterName } = {
  'シェリー': 'shelly', 'ニタ': 'nita', 'コルト': 'colt', 'ブル': 'bull', 'ブロック': 'brock',
  'エルプリモ': 'elPrimo', 'バーリー': 'barley', 'ポコ': 'poco', 'ローサ': 'rosa', 'ジェシー': 'jessie',
  'ダイナマイク': 'dynamike', 'ティック': 'tick', '8ビット': 'eightBit', 'リコ': 'rico', 'ダリル': 'darryl',
  'ペニー': 'penny', 'カール': 'carl', 'ジャッキー': 'jacky', 'ガス': 'gus', 'ボウ': 'bo', 'Emz': 'emz',
  'ストゥー': 'stu', 'エリザベス': 'piper', 'パム': 'pam', 'フランケン': 'frank', 'ビビ': 'bibi',
  'ビー': 'bea', 'ナーニ': 'nani', 'エドガー': 'edgar', 'グリフ': 'griff', 'グロム': 'grom',
  'ボニー': 'bonnie', 'ゲイル': 'gale', 'コレット': 'colette', 'ベル': 'belle', 'アッシュ': 'ash',
  'ローラ': 'lola', 'サム': 'sam', 'マンディ': 'mandy', 'メイジー': 'maisie', 'ハンク': 'hank',
  'パール': 'pearl', 'ラリー&ローリー': 'larryandLawrie', 'アンジェロ': 'angelo', 'ベリー': 'berry',
  'シェイド': 'shade', 'モーティス': 'mortis', 'タラ': 'tara', 'ジーン': 'gene', 'Max': 'max',
  'ミスターP': 'mrp', 'スプラウト': 'sprout', 'バイロン': 'byron', 'スクウィーク': 'squeak', 'ルー': 'lou',
  'ラフス': 'ruffs', 'バズ': 'buzz', 'ファング': 'fang', 'イヴ': 'eve', 'ジャネット': 'janet',
  'オーティス': 'otis', 'バスター': 'buster', 'グレイ': 'gray', 'R-T': 'rt', 'ウィロー': 'willow',
  'ダグ': 'doug', 'チャック': 'chuck', 'チャーリー': 'charlie', 'ミコ': 'mico', 'メロディー': 'melodie',
  'リリー': 'lily', 'クランシー': 'clancy', 'モー': 'moe', 'ジュジュ': 'juju', 'スパイク': 'spike',
  'クロウ': 'crow', 'レオン': 'leon', 'サンディ': 'sandy', 'アンバー': 'amber', 'メグ': 'meg',
  'サージ': 'surge', 'チェスター': 'chester', 'コーデリアス': 'cordelius', 'キット': 'kit',
  'ドラコ': 'draco', 'ケンジ': 'kenji', 'Mr.P': 'mrp', 'MAX': 'max', 
};

  const getImageSource = () => {
    const identifier = nameToIdentifier[characterName];
    if (identifier && isValidCharacterName(identifier)) {
      return CHARACTER_IMAGES[identifier];
    }
    console.warn(`Invalid character name: ${characterName} (${identifier})`);
    return CHARACTER_IMAGES.shelly;
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={getImageSource()}
        style={styles.image}
        resizeMode="contain"
        onError={(error) => {
          console.error('Error loading character image:', error.nativeEvent.error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default CharacterImage;