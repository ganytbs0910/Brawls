import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CHARACTER_IMAGES, isValidCharacterName, CharacterName } from '../data/characterImages';

interface CharacterImageProps {
  characterName: string;
  size?: number;
  style?: object;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ characterName, size = 50, style }) => {
  // 日本語名からキャラクター識別子への変換マップ
  const nameToIdentifier: { [key: string]: CharacterName } = {
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
    // ... 他のキャラクター名のマッピング
  };

  // 日本語名を識別子に変換
  const identifier = nameToIdentifier[characterName] as CharacterName;

  // 画像ソースの取得
  const getImageSource = () => {
    if (identifier && isValidCharacterName(identifier)) {
      return CHARACTER_IMAGES[identifier];
    }
    console.warn(`Invalid character name: ${characterName} (${identifier})`);
    return CHARACTER_IMAGES.shelly; // デフォルトとしてシェリーの画像を使用
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