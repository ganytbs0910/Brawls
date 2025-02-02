import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalizedText {
  ja: string;
  en: string;
  ko: string;
}

interface Tip {
  id: number;
  title: LocalizedText;
  content: LocalizedText;
}

export const DAILY_TIPS: Tip[] = [
  {
    id: 1,
    title: {
      ja: "グレイのガジェット",
      en: "Gray's Gadget",
      ko: "그레이의 가젯"
    },
    content: {
      ja: "ガジェットで敵を引きつけた直後にウルトのワープを使用すると、引き寄せる距離が増加します！",
      en: "Using the ultimate warp right after pulling enemies with the gadget increases the pull distance!",
      ko: "가젯으로 적을 끌어당긴 직후에 궁극기 워프를 사용하면 끌어당기는 거리가 증가합니다!"
    }
  },
  {
    id: 2,
    title: {
      ja: "ビビのウルト多段ヒット",
      en: "Bibi's Multi-hit Ultimate",
      ko: "비비의 궁극기 다단 히트"
    },
    content: {
      ja: "ビビの弾く攻撃を打った直後にウルトを打つと、バブル攻撃が2回ヒットします！",
      en: "If you use your ultimate right after Bibi's bounce attack, the bubble attack will hit twice!",
      ko: "비비의 튕기는 공격을 한 직후에 궁극기를 사용하면 버블 공격이 2번 히트합니다!"
    }
  },
  {
    id: 3,
    title: {
      ja: "キットのスタパ「上昇志向」の豆知識",
      en: "Kit's Star Power 'Upward Mobility' Tip",
      ko: "키트의 스타파워 '상승지향' 팁"
    },
    content: {
      ja: "デュオバトロワで味方がとっても強化倍率が入らないため、できるだけ自分で拾うことを心がけよう！",
      en: "In Duo Battle Royale, power-ups don't affect your teammate, so try to collect them yourself!",
      ko: "듀오 배틀로얄에서 팀원이 먹어도 강화 배율이 적용되지 않으므로 가능한 한 직접 줍는 것이 좋습니다!"
    }
  },
  {
    id: 4,
    title: {
      ja: "ガスのゴースト",
      en: "Gus's Ghost",
      ko: "거스의 고스트"
    },
    content: {
      ja: "最大射程で最短の球発射をするとゴーストが2体生成されることがあります！",
      en: "Firing the shortest orb at maximum range can sometimes generate 2 ghosts!",
      ko: "최대 사거리에서 최단 구를 발사하면 고스트가 2개 생성될 수 있습니다!"
    }
  },
  {
    id: 5,
    title: {
      ja: "ステージのギミックを消せる",
      en: "Remove Stage Gimmicks",
      ko: "스테이지 기믹을 제거할 수 있습니다"
    },
    content: {
      ja: "ローサのガジェット「成長促進ライト」を使用すると針などのギミックを消すことができる",
      en: "Rosa's 'Growth Light' gadget can remove gimmicks like spikes",
      ko: "로사의 가젯 '성장 촉진 라이트'를 사용하면 가시 등의 기믹을 제거할 수 있습니다"
    }
  },
  {
    id: 6,
    title: {
      ja: "壁裏への攻撃判定",
      en: "Attack Through Walls",
      ko: "벽 뒤로의 공격 판정"
    },
    content: {
      ja: "クランシーのウルトとブロックの攻撃は壁裏に張り付いている敵を攻撃できる",
      en: "Griff's ultimate and Block's attacks can hit enemies sticking to the other side of walls",
      ko: "그리프의 궁극기와 블록의 공격은 벽 뒤에 붙어있는 적을 공격할 수 있습니다"
    }
  },
  {
    id: 7,
    title: {
      ja: "回復の判定",
      en: "Healing Mechanics",
      ko: "회복 판정"
    },
    content: {
      ja: "バイロンやポコのウルトの回復は空中の味方を回復させることができる",
      en: "Byron and Poco's ultimate healing can heal allies who are in the air",
      ko: "바이런과 포코의 궁극기 회복은 공중에 있는 아군을 회복시킬 수 있습니다"
    }
  },
  {
    id: 8,
    title: {
      ja: "タラのサイキック活性化剤の秘密",
      en: "Tara's Psychic Enhancer Secret",
      ko: "타라의 사이킥 인핸서의 비밀"
    },
    content: {
      ja: "レオンやキット、サンディのウルトなどで消えている敵も見ることができる",
      en: "Can reveal invisible enemies using Leon, Kit, or Sandy's ultimates",
      ko: "레온이나 키트, 샌디의 궁극기로 숨어있는 적도 볼 수 있습니다"
    }
  },
  {
    id: 9,
    title: {
      ja: "キットのウルト",
      en: "Kit's Ultimate",
      ko: "키트의 궁극기"
    },
    content: {
      ja: "ボールを所持している敵に飛びつくと自分がボールを持っている判定になる",
      en: "Jumping on an enemy holding the ball will transfer ball possession to you",
      ko: "공을 가지고 있는 적에게 뛰어오르면 자신이 공을 가지게 됩니다"
    }
  },
  {
    id: 10,
    title: {
      ja: "バスターのウルト",
      en: "Buster's Ultimate",
      ko: "버스터의 궁극기"
    },
    content: {
      ja: "これを使用するとメロディーの音符を消滅させ、無効化させられる",
      en: "Using this can eliminate and nullify Melody's musical notes",
      ko: "이것을 사용하면 멜로디의 음표를 소멸시키고 무효화시킬 수 있습니다"
    }
  },
  {
    id: 11,
    title: {
      ja: "パワー11までの強化費用",
      en: "Power 11 Upgrade Cost",
      ko: "파워 11까지의 강화 비용"
    },
    content: {
      ja: "最大強化までには7765のコインとパワーポイントが必要（スタパやガジェなど全て含むと17765コイン必要）",
      en: "Requires 7,765 coins and power points to max out (17,765 coins including star powers and gadgets)",
      ko: "최대 강화까지 7,765 코인과 파워포인트가 필요합니다 (스타파워와 가젯 등 모두 포함하면 17,765 코인 필요)"
    }
  },
  {
    id: 12,
    title: {
      ja: "コレットの攻撃のカラクリ",
      en: "Colette's Attack Mechanic",
      ko: "콜레트의 공격 매커니즘"
    },
    content: {
      ja: "シールドがついている敵以外は通常攻撃2発とウルト往復で全ての敵を倒せる",
      en: "Can defeat any non-shielded enemy with 2 normal attacks and a round-trip ultimate",
      ko: "실드가 있는 적을 제외하고는 일반 공격 2회와 궁극기 왕복으로 모든 적을 처치할 수 있습니다"
    }
  },
  {
    id: 13,
    title: {
      ja: "ストゥーのウルトの向き",
      en: "Stu's Ultimate Direction",
      ko: "스투의 궁극기 방향"
    },
    content: {
      ja: "ウルトをタップでオートエイムすると移動スティックを倒している方向に移動する",
      en: "When auto-aiming the ultimate with tap, you'll dash in the direction of your movement stick",
      ko: "궁극기를 탭으로 자동 조준하면 이동 스틱을 누르고 있는 방향으로 이동합니다"
    }
  },
  {
    id: 14,
    title: {
      ja: "ダリルのガジェット「パワースプリング」",
      en: "Darryl's 'Recoiling Rotator' Gadget",
      ko: "대릴의 가젯 '파워 스프링'"
    },
    content: {
      ja: "金庫の左上に立って→↘︎↓↙︎←↖︎↑の方向に動きながらガジェットを使うと全弾当たる",
      en: "Standing at the top-left of the safe and moving in a circular motion while using the gadget will hit all shots",
      ko: "금고의 좌상단에 서서 →↘↓↙←↖↑ 방향으로 움직이면서 가젯을 사용하면 모든 탄환이 맞습니다"
    }
  },
  {
    id: 15,
    title: {
      ja: "マスタリーの報酬(ウルトラレア未満)",
      en: "Mastery Rewards (Below Ultra Rare)",
      ko: "마스터리 보상 (울트라 레어 미만)"
    },
    content: {
      ja: "コイン:2000, パワーポイント:300, クレジット:225を受け取ることができます",
      en: "You can receive 2,000 coins, 300 power points, and 225 credits",
      ko: "코인: 2000, 파워포인트: 300, 크레딧: 225를 받을 수 있습니다"
    }
  },
  {
    id: 16,
    title: {
      ja: "マスタリーの報酬(ウルトラレア以上)",
      en: "Mastery Rewards (Ultra Rare and Above)",
      ko: "마스터리 보상 (울트라 레어 이상)"
    },
    content: {
      ja: "コイン:3000, パワーポイント:450, クレジット:300を受け取ることができます",
      en: "You can receive 3,000 coins, 450 power points, and 300 credits",
      ko: "코인: 3000, 파워포인트: 450, 크레딧: 300을 받을 수 있습니다"
    }
  },
  {
    id: 17,
    title: {
      ja: "マスタリーの効率の良い集め方",
      en: "Efficient Mastery Collection",
      ko: "마스터리 효율적인 수집 방법"
    },
    content: {
      ja: "マスタリーはトロフィーが高ければ高いほど受け取れる量が増えます",
      en: "The higher your trophy count, the more mastery rewards you can receive",
      ko: "마스터리는 트로피가 높을수록 받을 수 있는 양이 증가합니다"
    }
  }
];

export const DailyTip: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ja' | 'en' | 'ko'>('ja');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLanguage = async () => {
      try {
        setIsLoading(true);
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && ['ja', 'en', 'ko'].includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage as 'ja' | 'en' | 'ko');
        }
      } catch (error) {
        console.error('Failed to get language setting:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getLanguage();
  }, []);

  useEffect(() => {
    const watchLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage !== currentLanguage && ['ja', 'en', 'ko'].includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage as 'ja' | 'en' | 'ko');
        }
      } catch (error) {
        console.error('Failed to watch language setting:', error);
      }
    };

    const interval = setInterval(watchLanguage, 1000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  const today = new Date();
  const tipIndex = today.getDate() % DAILY_TIPS.length;
  const todaysTip = DAILY_TIPS[tipIndex];

  const headerText: LocalizedText = {
    ja: '今日の豆知識',
    en: "Today's Tip",
    ko: '오늘의 팁'
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.tipContainer}>
      <Text style={styles.tipHeader}>{headerText[currentLanguage]}</Text>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{todaysTip.title[currentLanguage]}</Text>
        <Text style={styles.tipText}>{todaysTip.content[currentLanguage]}</Text>
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