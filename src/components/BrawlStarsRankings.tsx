import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';
import CharacterImage from './CharacterImage';

interface RankingItem {
  rank: number;
  characterName: string;
  description: string;
}

interface CharacterType {
  id: string;
  characters: string[];
}

const BrawlStarsRankings: React.FC<{ selectedType: string }> = ({ selectedType }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const getCharacterInfo = (originalName: string) => {
    return t.rankings.characters[originalName];
  };

  // キャラクタータイプごとのリスト
  const characterTypes: { [key: string]: string[] } = {
    all: [
      "シェイド", "ストゥー", "ガス", "モー", "ケンジ", "サージ", "バイロン", "ダリル", 
      "フランケン", "リコ", "ラリー&ローリー", "ジュジュ", "ペニー", "クランシー", "MAX",
      "サンディ", "キット", "ニタ", "メロディー", "バスター", "エリザベス", "マンディ",
      "アンジェロ", "R-T", "オーティス", "ラフス", "クロウ", "モーティス", "ベル", "ジーン",
      "ローラ", "コレット", "ドラコ", "グレイ", "カール", "チェスター", "ビー", "アンバー",
      "パール", "リリー", "ゲイル", "イヴ", "バーリー", "ティック", "ダイナマイク", "コーデリアス",
      "タラ", "8ビット", "コルト", "スクウィーク", "グリフ", "メイジー", "ナーニ", "ジェシー",
      "バズ", "Emz", "メグ", "エルプリモ", "ビビ", "ローサ", "チャック", "パム",
      "ジャッキー", "ウィロー", "スプラウト", "ベリー", "チャーリー", "レオン", "スパイク",
      "ルー", "ポコ", "シェリー", "ジャネット", "ブロック", "ボニー", "ボウ", "サム",
      "ファング", "Mr.P", "エドガー", "ハンク", "ブル", "アッシュ", "グロム", "ダグ", "ミコ"
    ],
  tank: [
    "ダリル", "フランケン", "バスター", "ドラコ", "ビビ", 
    "エルプリモ", "ローサ", "ジャッキー", "ブル", "アッシュ", 
    "サム", "ハンク", "バズ", "ダグ", "メグ"
  ],
  thrower: [
    "ラリー&ローリー", "ジュジュ", "バーリー", "ティック", 
    "ダイナマイク", "スプラウト", "ウィロー", "グロム"
  ],
  assassin: [
    "シェイド", "ストゥー", "ケンジ", "メロディー", "クロウ",
    "モーティス", "リリー", "コーデリアス", "レオン", "ファング",
    "エドガー", "ミコ"
  ],
  sniper: [
    "エリザベス", "マンディ", "アンジェロ", "ベル", "ビー",
    "ナーニ", "メイジー", "ブロック", "ボニー", "ジャネット"
  ],
  attacker: [
    "モー", "サージ", "リコ", "クランシー", "ニタ",
    "ローラ", "コレット", "カール", "チェスター", "パール",
    "イヴ", "タラ", "8ビット", "スパイク", "R-T"
  ],
  support: [
    "ガス", "バイロン", "キット", "ラフス", "グレイ",
    "パム", "ベリー", "ポコ", "MAX"
  ],
  controller: [
    "ペニー", "サンディ", "オーティス", "ジーン", "アンバー",
    "ゲイル", "スクウィーク", "グリフ", "ジェシー", "Emz",
    "チャック", "チャーリー", "ルー", "ボウ", "Mr.P"
  ]
  };

  const rankings: RankingItem[] = [
    { rank: 1, characterName: "シェイド", description: "罠設置と長距離攻撃" },
    { rank: 2, characterName: "ストゥー", description: "現環境最強のブロッカー。高いHPと強力な範囲攻撃が特徴" },
    { rank: 3, characterName: "ガス", description: "形態変化による高い汎用性と驚異的な火力を持つ" },
    { rank: 4, characterName: "モー", description: "安定した攻撃力と優れたサポート能力を持つ" },
    { rank: 5, characterName: "ケンジ", description: "広範囲な攻撃と高い機動力で戦場を支配" },
    { rank: 6, characterName: "サージ", description: "ロボット形態の圧倒的な性能と優れた回復力" },
    { rank: 7, characterName: "バイロン", description: "強力な範囲攻撃とチーム全体へのサポート力" },
    { rank: 8, characterName: "ダリル", description: "長距離からの高火力と敵の動きを制限する能力" },
    { rank: 9, characterName: "フランケン", description: "優れた制圧力と敵を翻弄する機動力" },
    { rank: 10, characterName: "リコ", description: "高いバースト火力と安定したコントロール能力" },
    { rank: 11, characterName: "ラリー&ローリー", description: "強力な範囲攻撃と効果的なゾーニング能力" },
    { rank: 12, characterName: "ジュジュ", description: "味方の回復と敵への攻撃を両立する万能性" },
    { rank: 13, characterName: "ペニー", description: "チームサポートと安定した火力を持つ" },
    { rank: 14, characterName: "クランシー", description: "高いバースト火力と優れた地形コントロール" },
    { rank: 15, characterName: "MAX", description: "効果的な範囲攻撃と安定したコントロール" },
    { rank: 16, characterName: "サンディ", description: "敵を引き寄せる独特な戦術と高い汎用性" },
    { rank: 17, characterName: "キット", description: "長距離からの高火力と壁破壊能力" },
    { rank: 18, characterName: "ニタ", description: "安定した長距離攻撃と優れた壁破壊能力" },
    { rank: 19, characterName: "メロディー", description: "範囲攻撃と砲台による効果的な制圧" },
    { rank: 20, characterName: "バスター", description: "高い耐久力と味方のサポート能力" },
    { rank: 21, characterName: "エリザベス", description: "効果的な範囲攻撃と敵の行動を制限する能力" },
    { rank: 22, characterName: "マンディ", description: "長距離からの正確な攻撃と高い火力" },
    { rank: 23, characterName: "アンジェロ", description: "範囲攻撃と強力なスーパースキル" },
    { rank: 24, characterName: "R-T", description: "地形変化による戦場のコントロール" },
    { rank: 25, characterName: "オーティス", description: "高い機動力と近接での驚異的な火力" },
    { rank: 26, characterName: "ラフス", description: "独特な攻撃パターンと高い戦術性" },
    { rank: 27, characterName: "クロウ", description: "高い機動力とチームサポート能力" },
    { rank: 28, characterName: "モーティス", description: "効果的なスタン効果と接近戦での強さ" },
    { rank: 29, characterName: "ベル", description: "壁を利用した攻撃と高いスキル性" },
    { rank: 30, characterName: "ジーン", description: "効果的な範囲攻撃とシールドサポート" },
    { rank: 31, characterName: "ローラ", description: "長距離攻撃とポーターによる制圧" },
    { rank: 32, characterName: "コレット", description: "継続的なダメージと範囲攻撃" },
    { rank: 33, characterName: "ドラコ", description: "高い耐久力と近接での強さ" },
    { rank: 34, characterName: "グレイ", description: "毒効果と高い機動力による牽制" },
    { rank: 35, characterName: "カール", description: "効果的な範囲攻撃と独特な戦術" },
    { rank: 36, characterName: "チェスター", description: "チャージ攻撃による高火力" },
    { rank: 37, characterName: "ビー", description: "壁越しの攻撃と範囲ダメージ" },
    { rank: 38, characterName: "アンバー", description: "ステルス能力と高いバースト火力" },
    { rank: 39, characterName: "パール", description: "範囲攻撃と味方を隠すスーパー" },
    { rank: 40, characterName: "リリー", description: "範囲攻撃と独特な移動能力" },
    { rank: 41, characterName: "ゲイル", description: "怒り効果による火力上昇" },
    { rank: 42, characterName: "イヴ", description: "連鎖的な攻撃と高い機動力" },
    { rank: 43, characterName: "バーリー", description: "操作可能な攻撃と高火力" },
    { rank: 44, characterName: "ティック", description: "範囲攻撃と効果的なスーパー" },
    { rank: 45, characterName: "ダイナマイク", description: "突進能力と近接での強さ" },
    { rank: 46, characterName: "コーデリアス", description: "範囲攻撃と効果的な牽制" },
    { rank: 47, characterName: "タラ", description: "近距離での高火力と範囲攻撃" },
    { rank: 48, characterName: "8ビット", description: "ノックバック効果と機動力" },
    { rank: 49, characterName: "コルト", description: "高速な近接攻撃と範囲攻撃" },
    { rank: 50, characterName: "スクウィーク", description: "高い耐久力と近接攻撃" },
    { rank: 51, characterName: "グリフ", description: "範囲回復と攻撃の両立" },
    { rank: 52, characterName: "メイジー", description: "継続ダメージと地域制圧" },
    { rank: 53, characterName: "ナーニ", description: "ブーメラン攻撃と壁破壊" },
    { rank: 54, characterName: "ジェシー", description: "熊の召喚と近距離攻撃" },
    { rank: 55, characterName: "バズ", description: "ハッチリングによる制圧" },
    { rank: 56, characterName: "Emz", description: "突進攻撃と高い耐久力" },
    { rank: 57, characterName: "メグ", description: "魔法攻撃と範囲効果" },
    { rank: 58, characterName: "エルプリモ", description: "掘削能力と近接攻撃" },
    { rank: 59, characterName: "ビビ", description: "回復と攻撃の組み合わせ" },
    { rank: 60, characterName: "ローサ", description: "投擲攻撃と範囲効果" },
    { rank: 61, characterName: "チャック", description: "インク攻撃と移動阻害" },
    { rank: 62, characterName: "パム", description: "近距離と遠距離の攻撃" },
    { rank: 63, characterName: "ジャッキー", description: "爆弾による地域制圧" },
    { rank: 64, characterName: "ウィロー", description: "高火力と攻撃力ブースト" },
    { rank: 65, characterName: "スプラウト", description: "投擲爆弾と壁破壊" },
    { rank: 66, characterName: "ベリー", description: "高いHPとスタン効果" },
    { rank: 67, characterName: "チャーリー", description: "高い機動力と吸血効果" },
    { rank: 68, characterName: "レオン", description: "近接での範囲攻撃" },
    { rank: 69, characterName: "スパイク", description: "粘着爆弾による攻撃" },
    { rank: 70, characterName: "ルー", description: "ステルス能力と近接攻撃" },
    { rank: 71, characterName: "ポコ", description: "回復とサポート能力" },
    { rank: 72, characterName: "シェリー", description: "範囲攻撃と特殊効果" },
    { rank: 73, characterName: "ジャネット", description: "範囲攻撃と制御能力" },
    { rank: 74, characterName: "ブロック", description: "変形能力と適応力" },
    { rank: 75, characterName: "ボニー", description: "アップグレード型の攻撃" },
    { rank: 76, characterName: "ボウ", description: "吹き飛ばし効果と範囲攻撃" },
    { rank: 77, characterName: "サム", description: "継続ダメージと範囲攻撃" },
    { rank: 78, characterName: "ファング", description: "高い耐久力とシールド" },
    { rank: 79, characterName: "Mr.P", description: "範囲攻撃と特殊効果" },
    { rank: 80, characterName: "エドガー", description: "HP比例ダメージ攻撃" },
    { rank: 81, characterName: "ハンク", description: "特殊な攻撃パターン" },
    { rank: 82, characterName: "ブル", description: "範囲攻撃と制御効果" },
    { rank: 83, characterName: "アッシュ", description: "二人一組の特殊な攻撃" },
    { rank: 84, characterName: "グロム", description: "凍結効果と範囲攻撃" },
    { rank: 85, characterName: "ダグ", description: "特殊な攻撃と効果" },
    { rank: 86, characterName: "ミコ", description: "タレット設置と電撃攻撃" }
  ].map(item => ({
    rank: item.rank,
    characterName: getCharacterInfo(item.characterName).name,
    description: getCharacterInfo(item.characterName).description
  }));

  const getFilteredRankings = () => {
    if (selectedType === 'all') {
      return rankings;
    }

    const filteredRankings = rankings.filter(item =>
      characterTypes[selectedType].includes(item.characterName)
    );

    return filteredRankings.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  };

  const filteredRankings = getFilteredRankings();

  return (
    <ScrollView style={styles.container}>
      {filteredRankings.map((item) => (
        <View key={item.rank} style={styles.rankingItem}>
          <View style={styles.rankContainer}>
            <Text style={styles.rankNumber} numberOfLines={1}>
              {item.rank}{t.rankings.rankSuffix}
            </Text>
          </View>
          <View style={styles.characterInfo}>
            <CharacterImage characterName={item.characterName} size={40} style={styles.characterImage} />
            <View style={styles.textContainer}>
              <Text style={styles.characterName}>{item.characterName}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rankContainer: {
    width: 45,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  characterInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterImage: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default BrawlStarsRankings;