export type PunishmentGameTranslation = {
  title: string;
  selectDifficulty: string;
  difficulties: {
    easy: string;
    normal: string;
    hard: string;
    extreme: string;
  };
  gameModes: {
    duoShowdown: string;
    gemGrab: string;
    brawlball: string;
    knockout: string;
  };
  challenges: {
    easy: string[];
    normal: string[];
    hard: string[];
    extreme: string[];
  };
  controls: {
    stop: string;
    spinning: string;
    spinAgain: string;
    spin: string;
    backToDifficulty: string;
  };
};

export const ja: PunishmentGameTranslation = {
  title: 'ブロスタチャレンジ',
  selectDifficulty: '難易度を選択してください',
  difficulties: {
    easy: '優しい',
    normal: '普通',
    hard: '厳しい',
    extreme: '鬼畜'
  },
  gameModes: {
    duoShowdown: 'バトルロワイヤル（デュオ）',
    gemGrab: 'エメラルドハント',
    brawlball: 'ブロストライカー',
    knockout: 'ノックアウト'
  },
  challenges: {
    easy: [
      "弱い方のスタパ使用",
      "弱い方のガジェット使用",
      "初動15秒操作を禁止",
      "野良でバトル"
    ],
    normal: [
      "ガジェット使用禁止",
      "ウルト使用禁止",
      "ハイパーチャージ使用禁止",
      "今一番トロ高いキャラを強制的に使用",
      "1回死んでからスタート",
      "スターパワー、ガジェット、ギアは弱い方を使用"
    ],
    hard: [
      "自分と他人の回復を禁止",
      "移動と攻撃ボタン反転でプレイ",
      "今一番トロ高いキャラを強制的に使用",
      "攻撃5回のみ",
      "3連勝するまで終われない",
      "2回死んでからスタート",
      "片手縛り",
      "味方全員投げキャラクター使用"
    ],
    extreme: [
      "上下反転でプレイ",
      "攻撃するの禁止",
      "チーム全員ウルトとガジェットとハイパーチャージ禁止",
      "5連勝するまで終われない",
      "負けたら即170エメラルド購入",
      "右半分の画面見れない縛り"
    ]
  },
  controls: {
    stop: 'STOP',
    spinning: 'スピン中...',
    spinAgain: 'もう一度！',
    spin: 'スロットを回す',
    backToDifficulty: '難易度選択に戻る'
  }
};

export const en: PunishmentGameTranslation = {
  title: 'Brawl Stars Challenge',
  selectDifficulty: 'Select Difficulty',
  difficulties: {
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard',
    extreme: 'Extreme'
  },
  gameModes: {
    duoShowdown: 'Duo Showdown',
    gemGrab: 'Gem Grab',
    brawlball: 'Brawl Ball',
    knockout: 'Knockout'
  },
  challenges: {
    easy: [
      "Use weaker Star Power",
      "Use weaker Gadget",
      "No movement for first 15 seconds",
      "Play with randoms"
    ],
    normal: [
      "No Gadgets",
      "No Super",
      "No Hypercharge",
      "Use your highest trophy brawler",
      "Start after one death",
      "Use weaker Star Power, Gadget and Gears"
    ],
    hard: [
      "No healing for you and teammates",
      "Reverse movement and attack controls",
      "Use your highest trophy brawler",
      "Only 5 attacks allowed",
      "Must win 3 games in a row",
      "Start after two deaths",
      "Play with one hand",
      "All teammates must use throwers"
    ],
    extreme: [
      "Play with inverted vertical controls",
      "No attacking allowed",
      "No Super, Gadget and Hypercharge for whole team",
      "Must win 5 games in a row",
      "Buy 170 Emeralds if you lose",
      "Can't see right half of screen"
    ]
  },
  controls: {
    stop: 'STOP',
    spinning: 'Spinning...',
    spinAgain: 'Spin Again!',
    spin: 'Spin Slots',
    backToDifficulty: 'Back to Difficulty'
  }
};

export const ko: PunishmentGameTranslation = {
  title: '브롤스타즈 챌린지',
  selectDifficulty: '난이도 선택',
  difficulties: {
    easy: '쉬움',
    normal: '보통',
    hard: '어려움',
    extreme: '극한'
  },
  gameModes: {
    duoShowdown: '듀오 쇼다운',
    gemGrab: '젬 그랩',
    brawlball: '브롤 볼',
    knockout: '녹아웃'
  },
  challenges: {
    easy: [
      "약한 스타파워 사용",
      "약한 가젯 사용",
      "시작 15초 동안 조작 금지",
      "랜덤 매칭으로 플레이"
    ],
    normal: [
      "가젯 사용 금지",
      "궁극기 사용 금지",
      "하이퍼차지 사용 금지",
      "가장 높은 트로피 브롤러 사용",
      "한 번 죽은 후 시작",
      "약한 스타파워, 가젯, 기어 사용"
    ],
    hard: [
      "자신과 팀원 회복 금지",
      "이동과 공격 버튼 반전",
      "가장 높은 트로피 브롤러 사용",
      "공격 5회만 가능",
      "3연승 할 때까지 계속",
      "두 번 죽은 후 시작",
      "한 손으로 플레이",
      "팀원 모두 투척 브롤러 사용"
    ],
    extreme: [
      "상하 반전으로 플레이",
      "공격 금지",
      "팀 전체 궁극기, 가젯, 하이퍼차지 금지",
      "5연승 할 때까지 계속",
      "패배시 에메랄드 170개 구매",
      "화면 오른쪽 절반 보지 않고 플레이"
    ]
  },
  controls: {
    stop: '정지',
    spinning: '회전 중...',
    spinAgain: '다시 돌리기!',
    spin: '슬롯 돌리기',
    backToDifficulty: '난이도 선택으로'
  }
};

export const punishmentGameTranslations = {
  ja,
  en,
  ko,
} as const;

export type Language = keyof typeof punishmentGameTranslations;

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePunishmentGameTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in punishmentGameTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to get language setting:', error);
      }
    };

    getLanguage();

    const watchLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in punishmentGameTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to watch language setting:', error);
      }
    };

    const interval = setInterval(watchLanguage, 1000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  return {
    t: punishmentGameTranslations[currentLanguage],
    currentLanguage,
  };
}