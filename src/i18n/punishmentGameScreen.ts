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
    duoShowdown: 'バトルロイヤル（デュオ）',
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

export const ar: PunishmentGameTranslation = {
  title: 'تحدي برول ستارز',
  selectDifficulty: 'اختر مستوى الصعوبة',
  difficulties: {
    easy: 'سهل',
    normal: 'عادي',
    hard: 'صعب',
    extreme: 'قاسي'
  },
  gameModes: {
    duoShowdown: 'ثنائي شوداون',
    gemGrab: 'جمع الجواهر',
    brawlball: 'كرة برول',
    knockout: 'ضربة قاضية'
  },
  challenges: {
    easy: [
      "استخدم قوة النجمة الأضعف",
      "استخدم الأداة الأضعف",
      "ممنوع التحرك لأول 15 ثانية",
      "العب مع لاعبين عشوائيين"
    ],
    normal: [
      "ممنوع استخدام الأدوات",
      "ممنوع استخدام السوبر",
      "ممنوع استخدام الشحن الفائق",
      "استخدم البطل صاحب أعلى كؤوس",
      "ابدأ بعد موت واحد",
      "استخدم قوة النجمة والأداة والمعدات الأضعف"
    ],
    hard: [
      "ممنوع الشفاء لك ولفريقك",
      "عكس أزرار الحركة والهجوم",
      "استخدم البطل صاحب أعلى كؤوس",
      "مسموح 5 هجمات فقط",
      "يجب الفوز 3 مرات متتالية",
      "ابدأ بعد موتين",
      "العب بيد واحدة",
      "كل الفريق يجب أن يستخدم شخصيات قاذفة"
    ],
    extreme: [
      "العب مع عكس التحكم العامودي",
      "ممنوع الهجوم",
      "ممنوع السوبر والأدوات والشحن الفائق للفريق كامل",
      "يجب الفوز 5 مرات متتالية",
      "اشتري 170 جوهرة إذا خسرت",
      "لا يمكنك رؤية نصف الشاشة اليمين"
    ]
  },
  controls: {
    stop: 'توقف',
    spinning: 'يدور...',
    spinAgain: 'أدر مرة أخرى!',
    spin: 'أدر القرعة',
    backToDifficulty: 'العودة إلى اختيار الصعوبة'
  }
};

export const fr: PunishmentGameTranslation = {
  title: 'Défi Brawl Stars',
  selectDifficulty: 'Sélectionner la difficulté',
  difficulties: {
    easy: 'Facile',
    normal: 'Normal',
    hard: 'Difficile',
    extreme: 'Extrême'
  },
  gameModes: {
    duoShowdown: 'Combat en duo',
    gemGrab: 'Capture de gemmes',
    brawlball: 'Brawl Ball',
    knockout: 'K.O.'
  },
  challenges: {
    easy: [
      "Utiliser le pouvoir étoilé le plus faible",
      "Utiliser le gadget le plus faible",
      "Pas de mouvement pendant 15 secondes",
      "Jouer avec des joueurs aléatoires"
    ],
    normal: [
      "Pas de gadgets",
      "Pas de Super",
      "Pas d'Hypercharge",
      "Utiliser le brawler avec le plus de trophées",
      "Commencer après une mort",
      "Utiliser le pouvoir étoilé, gadget et équipement les plus faibles"
    ],
    hard: [
      "Pas de soin pour vous et vos coéquipiers",
      "Inverser les contrôles de mouvement et d'attaque",
      "Utiliser le brawler avec le plus de trophées",
      "Seulement 5 attaques autorisées",
      "Gagner 3 parties d'affilée",
      "Commencer après deux morts",
      "Jouer avec une seule main",
      "Toute l'équipe doit utiliser des lanceurs"
    ],
    extreme: [
      "Jouer avec les contrôles verticaux inversés",
      "Interdiction d'attaquer",
      "Pas de Super, gadget et Hypercharge pour toute l'équipe",
      "Gagner 5 parties d'affilée",
      "Acheter 170 Émeraudes si vous perdez",
      "Ne pas voir la moitié droite de l'écran"
    ]
  },
  controls: {
    stop: 'STOP',
    spinning: 'En rotation...',
    spinAgain: 'Relancer!',
    spin: 'Lancer la roulette',
    backToDifficulty: 'Retour à la difficulté'
  }
};

export const es: PunishmentGameTranslation = {
  title: 'Desafío Brawl Stars',
  selectDifficulty: 'Seleccionar dificultad',
  difficulties: {
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    extreme: 'Extremo'
  },
  gameModes: {
    duoShowdown: 'Supervivencia por parejas',
    gemGrab: 'Atrapagemas',
    brawlball: 'Brawl Ball',
    knockout: 'Nocaut'
  },
  challenges: {
    easy: [
      "Usar el poder estelar más débil",
      "Usar el gadget más débil",
      "Sin movimiento durante 15 segundos",
      "Jugar con aleatorios"
    ],
    normal: [
      "Sin gadgets",
      "Sin Super",
      "Sin Hipercarga",
      "Usar el brawler con más trofeos",
      "Empezar después de una muerte",
      "Usar el poder estelar, gadget y equipamiento más débiles"
    ],
    hard: [
      "Sin curación para ti y tus compañeros",
      "Controles de movimiento y ataque invertidos",
      "Usar el brawler con más trofeos",
      "Solo 5 ataques permitidos",
      "Ganar 3 partidas seguidas",
      "Empezar después de dos muertes",
      "Jugar con una sola mano",
      "Todo el equipo debe usar lanzadores"
    ],
    extreme: [
      "Jugar con controles verticales invertidos",
      "Prohibido atacar",
      "Sin Super, gadget e Hipercarga para todo el equipo",
      "Ganar 5 partidas seguidas",
      "Comprar 170 Esmeraldas si pierdes",
      "No ver la mitad derecha de la pantalla"
    ]
  },
  controls: {
    stop: 'PARAR',
    spinning: 'Girando...',
    spinAgain: '¡Girar otra vez!',
    spin: 'Girar ruleta',
    backToDifficulty: 'Volver a dificultad'
  }
};

export const zhTw: PunishmentGameTranslation = {
  title: '荒野亂鬥挑戰',
  selectDifficulty: '選擇難度',
  difficulties: {
    easy: '簡單',
    normal: '普通',
    hard: '困難',
    extreme: '極限'
  },
  gameModes: {
    duoShowdown: '雙人生存',
    gemGrab: '寶石爭奪',
    brawlball: '荒野足球',
    knockout: '淘汰賽'
  },
  challenges: {
    easy: [
      "使用較弱的星力",
      "使用較弱的道具",
      "開局15秒內不能移動",
      "與隨機玩家配對"
    ],
    normal: [
      "禁止使用道具",
      "禁止使用必殺技",
      "禁止使用超級充能",
      "必須使用最高獎盃的角色",
      "死亡一次後才能開始",
      "使用最弱的星力、道具和裝備"
    ],
    hard: [
      "禁止你和隊友回血",
      "移動和攻擊按鈕反轉",
      "必須使用最高獎盃的角色",
      "只能攻擊5次",
      "必須連勝3場",
      "死亡兩次後才能開始",
      "單手操作",
      "全隊必須使用投擲型角色"
    ],
    extreme: [
      "上下反轉操作",
      "禁止攻擊",
      "全隊禁止使用必殺技、道具和超級充能",
      "必須連勝5場",
      "輸了要購買170寶石",
      "看不到螢幕右半部"
    ]
  },
  controls: {
    stop: '停止',
    spinning: '旋轉中...',
    spinAgain: '再轉一次！',
    spin: '轉動輪盤',
    backToDifficulty: '返回難度選擇'
  }
};

// 翻訳オブジェクトをまとめたもの
export const punishmentGameTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw // 台湾語を追加
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