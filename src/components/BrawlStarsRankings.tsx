import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import CharacterImage from './CharacterImage';

interface RankingItem {
  rank: number;
  characterName: string;
  description: string;
}

const BrawlStarsRankings: React.FC = () => {
  const rankings: RankingItem[] = [
    { rank: 1, characterName: "パール", description: "現環境最強のブロッカー。高いHPと強力な範囲攻撃が特徴" },
    { rank: 2, characterName: "ボニー", description: "形態変化による高い汎用性と驚異的な火力を持つ" },
    { rank: 3, characterName: "サム", description: "安定した攻撃力と優れたサポート能力を持つ" },
    { rank: 4, characterName: "ジャネット", description: "広範囲な攻撃と高い機動力で戦場を支配" },
    { rank: 5, characterName: "メグ", description: "ロボット形態の圧倒的な性能と優れた回復力" },
    { rank: 6, characterName: "R-T", description: "強力な範囲攻撃とチーム全体へのサポート力" },
    { rank: 7, characterName: "ベル", description: "長距離からの高火力と敵の動きを制限する能力" },
    { rank: 8, characterName: "チャーリー", description: "優れた制圧力と敵を翻弄する機動力" },
    { rank: 9, characterName: "グレイ", description: "高いバースト火力と安定したコントロール能力" },
    { rank: 10, characterName: "コーデリアス", description: "強力な範囲攻撃と効果的なゾーニング能力" },
    { rank: 11, characterName: "バイロン", description: "味方の回復と敵への攻撃を両立する万能性" },
    { rank: 12, characterName: "ラフス", description: "チームサポートと安定した火力を持つ" },
    { rank: 13, characterName: "スパイク", description: "高いバースト火力と優れた地形コントロール" },
    { rank: 14, characterName: "メロディー", description: "効果的な範囲攻撃と安定したコントロール" },
    { rank: 15, characterName: "ジーン", description: "敵を引き寄せる独特な戦術と高い汎用性" },
    { rank: 16, characterName: "コルト", description: "長距離からの高火力と壁破壊能力" },
    { rank: 17, characterName: "ブロック", description: "安定した長距離攻撃と優れた壁破壊能力" },
    { rank: 18, characterName: "ペニー", description: "範囲攻撃と砲台による効果的な制圧" },
    { rank: 19, characterName: "パム", description: "高い耐久力と味方のサポート能力" },
    { rank: 20, characterName: "マンディ", description: "効果的な範囲攻撃と敵の行動を制限する能力" },
    { rank: 21, characterName: "エリザベス", description: "長距離からの正確な攻撃と高い火力" },
    { rank: 22, characterName: "タラ", description: "範囲攻撃と強力なスーパースキル" },
    { rank: 23, characterName: "スプラウト", description: "地形変化による戦場のコントロール" },
    { rank: 24, characterName: "エドガー", description: "高い機動力と近接での驚異的な火力" },
    { rank: 25, characterName: "ケンジ", description: "独特な攻撃パターンと高い戦術性" },
    { rank: 26, characterName: "MAX", description: "高い機動力とチームサポート能力" },
    { rank: 27, characterName: "バズ", description: "効果的なスタン効果と接近戦での強さ" },
    { rank: 28, characterName: "リコ", description: "壁を利用した攻撃と高いスキル性" },
    { rank: 29, characterName: "ガス", description: "効果的な範囲攻撃とシールドサポート" },
    { rank: 30, characterName: "ミスターP", description: "長距離攻撃とポーターによる制圧" },
    { rank: 31, characterName: "アンバー", description: "継続的なダメージと範囲攻撃" },
    { rank: 32, characterName: "ローラ", description: "高い耐久力と近接での強さ" },
    { rank: 33, characterName: "クロウ", description: "毒効果と高い機動力による牽制" },
    { rank: 34, characterName: "チェスター", description: "効果的な範囲攻撃と独特な戦術" },
    { rank: 35, characterName: "ビー", description: "チャージ攻撃による高火力" },
    { rank: 36, characterName: "グロム", description: "壁越しの攻撃と範囲ダメージ" },
    { rank: 37, characterName: "レオン", description: "ステルス能力と高いバースト火力" },
    { rank: 38, characterName: "サンディ", description: "範囲攻撃と味方を隠すスーパー" },
    { rank: 39, characterName: "ドラコ", description: "範囲攻撃と独特な移動能力" },
    { rank: 40, characterName: "アッシュ", description: "怒り効果による火力上昇" },
    { rank: 41, characterName: "ファング", description: "連鎖的な攻撃と高い機動力" },
    { rank: 42, characterName: "ナーニ", description: "操作可能な攻撃と高火力" },
    { rank: 43, characterName: "バスター", description: "範囲攻撃と効果的なスーパー" },
    { rank: 44, characterName: "ダリル", description: "突進能力と近接での強さ" },
    { rank: 45, characterName: "ウィロー", description: "範囲攻撃と効果的な牽制" },
    { rank: 46, characterName: "シェリー", description: "近距離での高火力と範囲攻撃" },
    { rank: 47, characterName: "ストゥー", description: "ノックバック効果と機動力" },
    { rank: 48, characterName: "ビビ", description: "高速な近接攻撃と範囲攻撃" },
    { rank: 49, characterName: "エルプリモ", description: "高い耐久力と近接攻撃" },
    { rank: 50, characterName: "ポコ", description: "範囲回復と攻撃の両立" },
    { rank: 51, characterName: "バーリー", description: "継続ダメージと地域制圧" },
    { rank: 52, characterName: "カール", description: "ブーメラン攻撃と壁破壊" },
    { rank: 53, characterName: "ニタ", description: "熊の召喚と近距離攻撃" },
    { rank: 54, characterName: "イヴ", description: "ハッチリングによる制圧" },
    { rank: 55, characterName: "ブル", description: "突進攻撃と高い耐久力" },
    { rank: 56, characterName: "メイジー", description: "魔法攻撃と範囲効果" },
    { rank: 57, characterName: "ダグ", description: "掘削能力と近接攻撃" },
    { rank: 58, characterName: "ボウ", description: "罠設置と長距離攻撃" },
    { rank: 59, characterName: "ミコ", description: "回復と攻撃の組み合わせ" },
    { rank: 60, characterName: "チャック", description: "投擲攻撃と範囲効果" },
    { rank: 61, characterName: "オーティス", description: "インク攻撃と移動阻害" },
    { rank: 62, characterName: "グリフ", description: "近距離と遠距離の攻撃" },
    { rank: 63, characterName: "ティック", description: "爆弾による地域制圧" },
    { rank: 64, characterName: "8ビット", description: "高火力と攻撃力ブースト" },
    { rank: 65, characterName: "ダイナマイク", description: "投擲爆弾と壁破壊" },
    { rank: 66, characterName: "フランケン", description: "高いHPとスタン効果" },
    { rank: 67, characterName: "モーティス", description: "高い機動力と吸血効果" },
    { rank: 68, characterName: "ジャッキー", description: "近接での範囲攻撃" },
    { rank: 69, characterName: "スクウィーク", description: "粘着爆弾による攻撃" },
    { rank: 70, characterName: "シェイド", description: "ステルス能力と近接攻撃" },
    { rank: 71, characterName: "アンジェロ", description: "回復とサポート能力" },
    { rank: 72, characterName: "ジュジュ", description: "範囲攻撃と特殊効果" },
    { rank: 73, characterName: "ハンク", description: "範囲攻撃と制御能力" },
    { rank: 74, characterName: "キット", description: "変形能力と適応力" },
    { rank: 75, characterName: "サージ", description: "アップグレード型の攻撃" },
    { rank: 76, characterName: "ゲイル", description: "吹き飛ばし効果と範囲攻撃" },
    { rank: 77, characterName: "Emz", description: "継続ダメージと範囲攻撃" },
    { rank: 78, characterName: "ローサ", description: "高い耐久力とシールド" },
    { rank: 79, characterName: "リリー", description: "範囲攻撃と特殊効果" },
    { rank: 80, characterName: "コレット", description: "HP比例ダメージ攻撃" },
    { rank: 81, characterName: "クランシー", description: "特殊な攻撃パターン" },
    { rank: 82, characterName: "ベリー", description: "範囲攻撃と制御効果" },
    { rank: 83, characterName: "ラリー&ローリー", description: "二人一組の特殊な攻撃" },
    { rank: 84, characterName: "ルー", description: "凍結効果と範囲攻撃" },
    { rank: 85, characterName: "モー", description: "特殊な攻撃と効果" },
    { rank: 86, characterName: "ジェシー", description: "タレット設置と電撃攻撃" }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>現環境最強キャラランキング</Text>
      {rankings.map((item) => (
        <View key={item.rank} style={styles.rankingItem}>
          <Text style={styles.rankNumber}>{item.rank}位</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
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