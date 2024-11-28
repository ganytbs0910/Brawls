import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const characterNames = ["シェリー", "ニタ", "コルト", "ブル", "ブロック", "エルプリモ", "バーリー", "ポコ", "ローサ", "ジェシー", "ダイナマイク", "ティック", "8ビット", "リコ", "ダリル", "ペニー", "カール", "ジャッキー", "ガス", "ボウ", "Emz", "ストゥー", "エリザベス", "パム", "フランケン", "ビビ", "ビー", "ナーニ", "エドガー", "グリフ", "グロム", "ボニー", "ゲイル", "コレット", "ベル", "アッシュ", "ローラ", "サム", "マンディ", "メイジー", "ハンク", "パール", "ラリー&ローリー", "アンジェロ", "ベリー", "シェイド", "モーティス", "タラ", "ジーン", "MAX", "ミスターP", "スプラウト", "バイロン", "スクウィーク", "ルー", "ラフス", "バズ", "ファング", "イヴ", "ジャネット", "オーティス", "バスター", "グレイ", "R-T", "ウィロー", "ダグ", "チャック", "チャーリー", "ミコ", "メロディー", "リリー", "クランシー", "モー", "ジュジュ", "スパイク", "クロウ", "レオン", "サンディ", "アンバー", "メグ", "サージ", "チェスター", "コーデリアス", "キット", "ドラコ", "ケンジ"];

type Compatibility = {
  [key: string]: { [key: string]: number };
};

const BrawlStarsCompatibility: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [compatibility, setCompatibility] = useState<Compatibility>({});

  // 相性データを生成する関数（実際のアプリではAPIやデータベースから取得することを想定）
  const generateCompatibility = (character: string) => {
    const result: { [key: string]: number } = {};
    characterNames.forEach(opponent => {
      if (opponent !== character) {
        // ランダムな相性値を生成（実際のアプリでは実データを使用）
        result[opponent] = Math.floor(Math.random() * 11);
      }
    });
    return result;
  };

  const handleCharacterSelect = (character: string) => {
    if (!compatibility[character]) {
      const newCompatibility = {...compatibility};
      newCompatibility[character] = generateCompatibility(character);
      setCompatibility(newCompatibility);
    }
    setSelectedCharacter(character);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>ブロウルスターズ キャラクター相性表</Text>
        
        {/* キャラクター選択ボタン */}
        <View style={styles.buttonContainer}>
          {characterNames.map((character) => (
            <TouchableOpacity
              key={character}
              style={[
                styles.button,
                selectedCharacter === character && styles.selectedButton
              ]}
              onPress={() => handleCharacterSelect(character)}
            >
              <Text style={styles.buttonText}>{character}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 相性表示 */}
        {selectedCharacter && compatibility[selectedCharacter] && (
          <View style={styles.compatibilityContainer}>
            <Text style={styles.subtitle}>
              {selectedCharacter}の相性表
            </Text>
            {Object.entries(compatibility[selectedCharacter])
              .sort(([, a], [, b]) => b - a)
              .map(([opponent, value]) => (
                <View key={opponent} style={styles.compatibilityRow}>
                  <Text style={styles.characterName}>{opponent}</Text>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.score}>{value}/10</Text>
                    <View 
                      style={[
                        styles.scoreBar,
                        { width: `${value * 10}%`, backgroundColor: getScoreColor(value) }
                      ]} 
                    />
                  </View>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// スコアに応じた色を返す関数
const getScoreColor = (score: number): string => {
  if (score >= 8) return '#4CAF50';  // 緑
  if (score >= 6) return '#2196F3';  // 青
  if (score >= 4) return '#FFC107';  // 黄
  return '#F44336';  // 赤
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 5,
  },
  button: {
    padding: 8,
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    minWidth: 80,
  },
  selectedButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
  },
  compatibilityContainer: {
    padding: 10,
  },
  compatibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  characterName: {
    width: 100,
    fontSize: 14,
  },
  scoreContainer: {
    flex: 1,
    marginLeft: 10,
  },
  score: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  scoreBar: {
    height: 20,
    borderRadius: 10,
  },
});

export default BrawlStarsCompatibility;