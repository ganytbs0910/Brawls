import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Tip {
  id: number;
  title: string;
  content: string;
}

export const DAILY_TIPS: Tip[] = [
  {
    id: 1,
    title: "グレイのガジェット",
    content: "ガジェットで敵を引きつけた直後にウルトのワープを使用すると、引き寄せる距離が増加します！"
  },
  {
    id: 2,
    title: "ビビのウルト多段ヒット",
    content: "ビビの弾く攻撃を打った直後にウルトを打つと、バブル攻撃が2回ヒットします！"
  },
  {
    id: 3,
    title: "キットのスタパ「上昇志向」の豆知識",
    content: "デュオバトロワで味方がとっても強化倍率が入らないため、できるだけ自分で拾うことを心がけよう！"
  },
  {
    id: 4,
    title: "ガスのゴースト",
    content: "最大射程で最短の球発射をするとゴーストが2体生成されることがあります！"
  },
  {
    id: 5,
    title: "ステージのギミックを消せる",
    content: "ローサのガジェット「成長促進ライト」を使用すると針などのギミックを消すことができる"
  },
  {
    id: 6,
    title: "壁裏への攻撃判定",
    content: "クランシーのウルトとブロックの攻撃は壁裏に張り付いている敵を攻撃できる"
  },
  {
    id: 7,
    title: "回復の判定",
    content: "バイロンやポコのウルトの回復は空中の味方を回復させることができる"
  },
  {
    id: 8,
    title: "タラのサイキック活性化剤の秘密",
    content: "レオンやキット、サンディのウルトなどで消えている敵も見ることができる"
  },
  {
    id: 9,
    title: "キットのウルト",
    content: "ボールを所持している敵に飛びつくと自分がボールを持っている判定になる"
  },
  {
    id: 10,
    title: "バスターのウルト",
    content: "これを使用するとメロディーの音符を消滅させ、無効化させられる"
  },
  {
    id: 11,
    title: "パワー11までの強化費用",
    content: "最大強化までには7765のコインとパワーポイントが必要（スタパやガジェなど全て含むと17765コイン必要）"
  },
  {
    id: 12,
    title: "コレットの攻撃のカラクリ",
    content: "シールドがついている敵以外は通常攻撃2発とウルト往復で全ての敵を倒せる"
  },
  {
    id: 13,
    title: "ストゥーのウルトの向き",
    content: "ウルトをタップでオートエイムすると移動スティックを倒している方向に移動する"
  },
  {
    id: 14,
    title: "ダリルのガジェット「パワースプリング」",
    content: "金庫の左上に立って→↘︎↓↙︎←↖︎↑の方向に動きながらガジェットを使うと全弾当たる"
  }
];

export const DailyTip: React.FC = () => {
  const today = new Date();
  const tipIndex = today.getDate() % DAILY_TIPS.length;
  const todaysTip = DAILY_TIPS[tipIndex];

  return (
    <View style={styles.tipContainer}>
      <Text style={styles.tipHeader}>今日の豆知識</Text>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{todaysTip.title}</Text>
        <Text style={styles.tipText}>{todaysTip.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tipContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tipHeader: {
    backgroundColor: '#21A0DB',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tipContent: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export default DailyTip;