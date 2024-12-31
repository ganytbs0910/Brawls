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
    title: "キットのスタパ「」",
    content: "デュオバトロワで味方がとっても強化倍率が入らないため、できるだけ自分で拾うことを心がけましょう！"
  },
  {
    id: 4,
    title: "ガスのゴースト",
    content: "最大射程で最短の球発射をするとゴーストが2体生成されることがあります！"
  },
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