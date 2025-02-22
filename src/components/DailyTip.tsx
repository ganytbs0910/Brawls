import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalizedText {
  ja: string;
  en: string;
  ko: string;
  ar: string;
  fr: string;
  es: string;
  zhTw: string;
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
      ko: "그레이의 가젯",
      ar: "أداة جراي",
      fr: "Gadget de Gray",
      es: "Gadget de Gray",
      zhTw: "葛雷的道具"
    },
    content: {
      ja: "ガジェットで敵を引きつけた直後にウルトのワープを使用すると、引き寄せる距離が増加します！",
      en: "Using the ultimate warp right after pulling enemies with the gadget increases the pull distance!",
      ko: "가젯으로 적을 끌어당긴 직후에 궁극기 워프를 사용하면 끌어당기는 거리가 증가합니다!",
      ar: "استخدام الانتقال النهائي بعد سحب الأعداء بالأداة مباشرة يزيد من مسافة السحب!",
      fr: "Utiliser la téléportation ultime juste après avoir attiré les ennemis avec le gadget augmente la distance d'attraction !",
      es: "¡Usar el teletransporte definitivo justo después de atraer a los enemigos con el gadget aumenta la distancia de atracción!",
      zhTw: "使用道具將敵人拉近後立即使用終極技能傳送，可以增加拉近的距離！"
    }
  },
  {
    id: 2,
    title: {
      ja: "ビビのウルト多段ヒット",
      en: "Bibi's Multi-hit Ultimate",
      ko: "비비의 궁극기 다단 히트",
      ar: "الضربة النهائية المتعددة لبيبي",
      fr: "Ultimate Multi-coup de Bibi",
      es: "Definitiva Multidisparo de Bibi",
      zhTw: "比比的終極技能多重打擊"
    },
    content: {
      ja: "ビビの弾く攻撃を打った直後にウルトを打つと、バブル攻撃が2回ヒットします！",
      en: "If you use your ultimate right after Bibi's bounce attack, the bubble attack will hit twice!",
      ko: "비비의 튕기는 공격을 한 직후에 궁극기를 사용하면 버블 공격이 2번 히트합니다!",
      ar: "إذا استخدمت الضربة النهائية بعد هجوم بيبي المرتد مباشرة، سيضرب هجوم الفقاعة مرتين!",
      fr: "Si vous utilisez l'ultime juste après l'attaque rebondissante de Bibi, l'attaque bulle frappera deux fois !",
      es: "¡Si usas la definitiva justo después del ataque rebote de Bibi, el ataque burbuja golpeará dos veces!",
      zhTw: "在比比的彈射攻擊後立即使用終極技能，泡泡攻擊會命中兩次！"
    }
  },
  {
    id: 3,
    title: {
      ja: "キットのスタパ「上昇志向」の豆知識",
      en: "Kit's Star Power 'Upward Mobility' Tip",
      ko: "키트의 스타파워 '상승지향' 팁",
      ar: "نصيحة حول قوة نجم كيت 'التنقل للأعلى'",
      fr: "Astuce sur le Pouvoir Stellaire 'Mobilité Ascendante' de Kit",
      es: "Consejo sobre el Poder Estelar 'Movilidad Ascendente' de Kit",
      zhTw: "奇特的星力「向上流動」小提示"
    },
    content: {
      ja: "デュオバトロワで味方がとっても強化倍率が入らないため、できるだけ自分で拾うことを心がけよう！",
      en: "In Duo Battle Royale, power-ups don't affect your teammate, so try to collect them yourself!",
      ko: "듀오 배틀로얄에서 팀원이 먹어도 강화 배율이 적용되지 않으므로 가능한 한 직접 줍는 것이 좋습니다!",
      ar: "في معركة الثنائي الملكية، لا تؤثر معززات القوة على زميلك في الفريق، لذا حاول جمعها بنفسك!",
      fr: "Dans la Bataille Royale en Duo, les bonus de puissance n'affectent pas votre coéquipier, alors essayez de les collecter vous-même !",
      es: "En Batalla Real en Dúo, las mejoras de poder no afectan a tu compañero de equipo, ¡así que intenta recogerlas tú mismo!",
      zhTw: "在雙人生存模式中，隊友拾取強化道具不會獲得加成效果，所以盡可能自己拾取！"
    }
  },
  {
    id: 4,
    title: {
      ja: "ガスのゴースト",
      en: "Gus's Ghost",
      ko: "거스의 고스트",
      ar: "شبح غاس",
      fr: "Le Fantôme de Gus",
      es: "El Fantasma de Gus",
      zhTw: "格斯的幽靈"
    },
    content: {
      ja: "最大射程で最短の球発射をするとゴーストが2体生成されることがあります！",
      en: "Firing the shortest orb at maximum range can sometimes generate 2 ghosts!",
      ko: "최대 사거리에서 최단 구를 발사하면 고스트가 2개 생성될 수 있습니다!",
      ar: "إطلاق أقصر كرة في المدى الأقصى يمكن أن يولد شبحين أحيانًا!",
      fr: "Tirer l'orbe la plus courte à portée maximale peut parfois générer 2 fantômes !",
      es: "¡Disparar el orbe más corto a máximo alcance puede generar 2 fantasmas a veces!",
      zhTw: "在最大射程發射最短的光球有時可以生成2個幽靈！"
    }
  },
  {
    id: 5,
    title: {
      ja: "ステージのギミックを消せる",
      en: "Remove Stage Gimmicks",
      ko: "스테이지 기믹을 제거할 수 있습니다",
      ar: "إزالة خدع المرحلة",
      fr: "Supprimer les Pièges du Terrain",
      es: "Eliminar Trampas del Escenario",
      zhTw: "可以消除場地機關"
    },
    content: {
      ja: "ローサのガジェット「成長促進ライト」を使用すると針などのギミックを消すことができる",
      en: "Rosa's 'Growth Light' gadget can remove gimmicks like spikes",
      ko: "로사의 가젯 '성장 촉진 라이트'를 사용하면 가시 등의 기믹을 제거할 수 있습니다",
      ar: "يمكن لأداة روزا 'ضوء النمو' إزالة الخدع مثل الأشواك",
      fr: "Le gadget 'Lumière de Croissance' de Rosa peut supprimer les pièges comme les pointes",
      es: "El gadget 'Luz de Crecimiento' de Rosa puede eliminar trampas como pinchos",
      zhTw: "使用蘿莎的道具「生長促進燈」可以消除尖刺等機關"
    }
  },
  {
    id: 6,
    title: {
      ja: "壁裏への攻撃判定",
      en: "Attack Through Walls",
      ko: "벽 뒤로의 공격 판정",
      ar: "الهجوم عبر الجدران",
      fr: "Attaque à Travers les Murs",
      es: "Ataque a Través de Paredes",
      zhTw: "穿牆攻擊判定"
    },
    content: {
      ja: "クランシーのウルトとブロックの攻撃は壁裏に張り付いている敵を攻撃できる",
      en: "Griff's ultimate and Block's attacks can hit enemies sticking to the other side of walls",
      ko: "그리프의 궁극기와 블록의 공격은 벽 뒤에 붙어있는 적을 공격할 수 있습니다",
      ar: "يمكن للضربة النهائية لغريف وهجمات بلوك أن تصيب الأعداء الملتصقين بالجانب الآخر من الجدران",
      fr: "L'ultime de Griff et les attaques de Block peuvent toucher les ennemis collés de l'autre côté des murs",
      es: "La definitiva de Griff y los ataques de Block pueden golpear a enemigos pegados al otro lado de las paredes",
      zhTw: "格里夫的終極技能和布洛克的攻擊可以打到貼在牆後的敵人"
    }
  },
  {
    id: 7,
    title: {
      ja: "回復の判定",
      en: "Healing Mechanics",
      ko: "회복 판정",
      ar: "آلية الشفاء",
      fr: "Mécanique de Guérison",
      es: "Mecánica de Curación",
      zhTw: "治療判定"
    },
    content: {
      ja: "バイロンやポコのウルトの回復は空中の味方を回復させることができる",
      en: "Byron and Poco's ultimate healing can heal allies who are in the air",
      ko: "바이런과 포코의 궁극기 회복은 공중에 있는 아군을 회복시킬 수 있습니다",
      ar: "يمكن للشفاء النهائي لبايرون وبوكو شفاء الحلفاء في الهواء",
      fr: "La guérison ultime de Byron et Poco peut soigner les alliés en l'air",
      es: "La curación definitiva de Byron y Poco puede curar a los aliados que están en el aire",
      zhTw: "拜倫和波可的終極技能治療可以治療在空中的隊友"
    }
  },
  {
    id: 8,
    title: {
      ja: "タラのサイキック活性化剤の秘密",
      en: "Tara's Psychic Enhancer Secret",
      ko: "타라의 사이킥 인핸서의 비밀",
      ar: "سر معزز القوى النفسية لتارا",
      fr: "Le Secret de l'Amplificateur Psychique de Tara",
      es: "El Secreto del Potenciador Psíquico de Tara",
      zhTw: "塔拉的精神增幅器秘密"
    },
    content: {
      ja: "レオンやキット、サンディのウルトなどで消えている敵も見ることができる",
      en: "Can reveal invisible enemies using Leon, Kit, or Sandy's ultimates",
      ko: "레온이나 키트, 샌디의 궁극기로 숨어있는 적도 볼 수 있습니다",
      ar: "يمكن كشف الأعداء المخفيين باستخدام القدرات النهائية لليون أو كيت أو ساندي",
      fr: "Peut révéler les ennemis invisibles utilisant les ultimes de Leon, Kit ou Sandy",
      es: "Puede revelar enemigos invisibles que usen las definitivas de Leon, Kit o Sandy",
      zhTw: "可以看見使用里昂、奇特或珊迪終極技能隱形的敵人"
    }
  },
  {
      id: 9,
      title: {
        ja: "キットのウルト",
        en: "Kit's Ultimate",
        ko: "키트의 궁극기",
        ar: "قدرة كيت النهائية",
        fr: "L'Ultimate de Kit",
        es: "Definitiva de Kit",
        zhTw: "奇特的終極技能"
      },
      content: {
        ja: "ボールを所持している敵に飛びつくと自分がボールを持っている判定になる",
        en: "Jumping on an enemy holding the ball will transfer ball possession to you",
        ko: "공을 가지고 있는 적에게 뛰어오르면 자신이 공을 가지게 됩니다",
        ar: "القفز على عدو يحمل الكرة سينقل حيازة الكرة إليك",
        fr: "Sauter sur un ennemi tenant la balle vous en donnera la possession",
        es: "Saltar sobre un enemigo que tiene la pelota transferirá la posesión de la pelota a ti",
        zhTw: "跳到持有球的敵人身上時，球的持有權會轉移給你"
      }
    },
    {
      id: 10,
      title: {
        ja: "バスターのウルト",
        en: "Buster's Ultimate",
        ko: "버스터의 궁극기",
        ar: "قدرة باستر النهائية",
        fr: "L'Ultimate de Buster",
        es: "Definitiva de Buster",
        zhTw: "巴斯特的終極技能"
      },
      content: {
        ja: "これを使用するとメロディーの音符を消滅させ、無効化させられる",
        en: "Using this can eliminate and nullify Melody's musical notes",
        ko: "이것을 사용하면 멜로디의 음표를 소멸시키고 무효화시킬 수 있습니다",
        ar: "استخدام هذا يمكن أن يزيل ويبطل نوتات ميلودي الموسيقية",
        fr: "L'utiliser peut éliminer et annuler les notes musicales de Melody",
        es: "Usar esto puede eliminar y anular las notas musicales de Melody",
        zhTw: "使用這個可以消除並無效化美洛蒂的音符"
      }
    },
    {
      id: 11,
      title: {
        ja: "パワー11までの強化費用",
        en: "Power 11 Upgrade Cost",
        ko: "파워 11까지의 강화 비용",
        ar: "تكلفة الترقية إلى القوة 11",
        fr: "Coût de l'Amélioration au Niveau 11",
        es: "Costo de Mejora al Poder 11",
        zhTw: "升級到能量等級11的費用"
      },
      content: {
        ja: "最大強化までには7765のコインとパワーポイントが必要（スタパやガジェなど全て含むと17765コイン必要）",
        en: "Requires 7,765 coins and power points to max out (17,765 coins including star powers and gadgets)",
        ko: "최대 강화까지 7,765 코인과 파워포인트가 필요합니다 (스타파워와 가젯 등 모두 포함하면 17,765 코인 필요)",
        ar: "يتطلب 7,765 عملة ونقاط قوة للوصول للحد الأقصى (17,765 عملة مع قوى النجوم والأدوات)",
        fr: "Nécessite 7 765 pièces et points de pouvoir pour maximiser (17 765 pièces avec les pouvoirs stellaires et les gadgets)",
        es: "Requiere 7.765 monedas y puntos de poder para maximizar (17.765 monedas incluyendo poderes estelares y gadgets)",
        zhTw: "升到最高等需要7,765個金幣和能量點數（包含星力和道具共需17,765個金幣）"
      }
    },
    {
      id: 12,
      title: {
        ja: "コレットの攻撃のカラクリ",
        en: "Colette's Attack Mechanic",
        ko: "콜레트의 공격 매커니즘",
        ar: "آلية هجوم كوليت",
        fr: "Mécanique d'Attaque de Colette",
        es: "Mecánica de Ataque de Colette",
        zhTw: "柯莉特的攻擊機制"
      },
      content: {
        ja: "シールドがついている敵以外は通常攻撃2発とウルト往復で全ての敵を倒せる",
        en: "Can defeat any non-shielded enemy with 2 normal attacks and a round-trip ultimate",
        ko: "실드가 있는 적을 제외하고는 일반 공격 2회와 궁극기 왕복으로 모든 적을 처치할 수 있습니다",
        ar: "يمكن هزيمة أي عدو غير محمي بدرع بهجومين عاديين وضربة نهائية ذهابًا وإيابًا",
        fr: "Peut vaincre n'importe quel ennemi sans bouclier avec 2 attaques normales et un ultime aller-retour",
        es: "Puede derrotar a cualquier enemigo sin escudo con 2 ataques normales y una definitiva de ida y vuelta",
        zhTw: "除了有護盾的敵人外，可以用2次普通攻擊和一次來回終極技能擊敗所有敵人"
      }
    },
    {
      id: 13,
      title: {
        ja: "ストゥーのウルトの向き",
        en: "Stu's Ultimate Direction",
        ko: "스투의 궁극기 방향",
        ar: "اتجاه قدرة ستو النهائية",
        fr: "Direction de l'Ultimate de Stu",
        es: "Dirección de la Definitiva de Stu",
        zhTw: "史杜終極技能的方向"
      },
      content: {
        ja: "ウルトをタップでオートエイムすると移動スティックを倒している方向に移動する",
        en: "When auto-aiming the ultimate with tap, you'll dash in the direction of your movement stick",
        ko: "궁극기를 탭으로 자동 조준하면 이동 스틱을 누르고 있는 방향으로 이동합니다",
        ar: "عند التصويب التلقائي للقدرة النهائية بالنقر، ستندفع في اتجاه عصا الحركة",
        fr: "En auto-visant l'ultime avec un tap, vous vous élancerez dans la direction de votre stick de mouvement",
        es: "Al auto-apuntar la definitiva con un toque, te impulsarás en la dirección de tu stick de movimiento",
        zhTw: "點擊自動瞄準終極技能時，會朝移動搖桿的方向衝刺"
      }
    },
    {
      id: 14,
      title: {
        ja: "ダリルのガジェット「パワースプリング」",
        en: "Darryl's 'Recoiling Rotator' Gadget",
        ko: "대릴의 가젯 '파워 스프링'",
        ar: "أداة داريل 'الدوار المرتد'",
        fr: "Gadget 'Rotateur à Recul' de Darryl",
        es: "Gadget 'Rotador de Retroceso' de Darryl",
        zhTw: "達利爾的「反衝旋轉」道具"
      },
      content: {
        ja: "金庫の左上に立って→↘︎↓↙︎←↖︎↑の方向に動きながらガジェットを使うと全弾当たる",
        en: "Standing at the top-left of the safe and moving in a circular motion while using the gadget will hit all shots",
        ko: "금고의 좌상단에 서서 →↘↓↙←↖↑ 방향으로 움직이면서 가젯을 사용하면 모든 탄환이 맞습니다",
        ar: "الوقوف في أعلى يسار الخزنة والتحرك بشكل دائري أثناء استخدام الأداة سيصيب جميع الطلقات",
        fr: "Se tenir en haut à gauche du coffre-fort et se déplacer en cercle tout en utilisant le gadget touchera tous les tirs",
        es: "Pararse en la parte superior izquierda de la caja fuerte y moverse en círculo mientras se usa el gadget hará que todos los disparos acierten",
        zhTw: "站在保險箱的左上角，並以→↘↓↙←↖↑的方向移動使用道具，所有子彈都會命中"
      }
    },
    {
      id: 15,
      title: {
        ja: "マスタリーの報酬(ウルトラレア未満)",
        en: "Mastery Rewards (Below Ultra Rare)",
        ko: "마스터리 보상 (울트라 레어 미만)",
        ar: "مكافآت الإتقان (دون النادر الفائق)",
        fr: "Récompenses de Maîtrise (En dessous d'Ultra Rare)",
        es: "Recompensas de Maestría (Por debajo de Ultra Raro)",
        zhTw: "精通獎勵（超稀有以下）"
      },
      content: {
        ja: "コイン:2000, パワーポイント:300, クレジット:225を受け取ることができます",
        en: "You can receive 2,000 coins, 300 power points, and 225 credits",
        ko: "코인: 2000, 파워포인트: 300, 크레딧: 225를 받을 수 있습니다",
        ar: "يمكنك الحصول على 2000 عملة و300 نقطة قوة و225 رصيدًا",
        fr: "Vous pouvez recevoir 2 000 pièces, 300 points de pouvoir et 225 crédits",
        es: "Puedes recibir 2.000 monedas, 300 puntos de poder y 225 créditos",
        zhTw: "可以獲得2,000金幣、300能量點數和225點數"
      }
    },
    {
      id: 16,
      title: {
        ja: "マスタリーの報酬(ウルトラレア以上)",
        en: "Mastery Rewards (Ultra Rare and Above)",
        ko: "마스터리 보상 (울트라 레어 이상)",
        ar: "مكافآت الإتقان (النادر الفائق وما فوق)",
        fr: "Récompenses de Maîtrise (Ultra Rare et au-dessus)",
        es: "Recompensas de Maestría (Ultra Raro y superior)",
        zhTw: "精通獎勵（超稀有以上）"
      },
      content: {
        ja: "コイン:3000, パワーポイント:450, クレジット:300を受け取ることができます",
        en: "You can receive 3,000 coins, 450 power points, and 300 credits",
        ko: "코인: 3000, 파워포인트: 450, 크레딧: 300을 받을 수 있습니다",
        ar: "يمكنك الحصول على 3000 عملة و450 نقطة قوة و300 رصيد",
        fr: "Vous pouvez recevoir 3 000 pièces, 450 points de pouvoir et 300 crédits",
        es: "Puedes recibir 3.000 monedas, 450 puntos de poder y 300 créditos",
        zhTw: "可以獲得3,000金幣、450能量點數和300點數"
      }
    },
    {
      id: 17,
      title: {
        ja: "マスタリーの効率の良い集め方",
        en: "Efficient Mastery Collection",
        ko: "마스터리 효율적인 수집 방법",
        ar: "جمع الإتقان بكفاءة",
        fr: "Collection Efficace de la Maîtrise",
        es: "Recolección Eficiente de Maestría",
        zhTw: "高效率的精通收集方式"
      },
      content: {
        ja: "マスタリーはトロフィーが高ければ高いほど受け取れる量が増えます",
        en: "The higher your trophy count, the more mastery rewards you can receive",
        ko: "마스터리는 트로피가 높을수록 받을 수 있는 양이 증가합니다",
        ar: "كلما ارتفع عدد الكؤوس، زادت مكافآت الإتقان التي يمكنك الحصول عليها",
        fr: "Plus votre nombre de trophées est élevé, plus vous recevrez de récompenses de maîtrise",
        es: "Cuanto más alto sea tu conteo de trofeos, más recompensas de maestría podrás recibir",
        zhTw: "獎盃數越高，可以獲得的精通獎勵就越多"
      }
    },
    {
      id: 18,
      title: {
        ja: "フランケンのハイチャウルトは真下で回避できる",
        en: "Frank's High-Charged Ultimate Can Be Dodged Directly Below",
        ko: "프랑켄의 하이차지 궁극기는 바로 아래로 피할 수 있습니다",
        ar: "يمكن تفادي قدرة فرانك النهائية عالية الشحن من الأسفل مباشرة",
        fr: "L'Ultimate Surcharge de Frank Peut Être Esquivée Directement en Dessous",
        es: "La Definitiva de Alta Carga de Frank se Puede Esquivar Directamente por Debajo",
        zhTw: "法蘭克的高充能終極技能可以直接從下方迴避"
      },
      content: {
        ja: "フランケンのハイチャウルトは方向が決まっており、真下が一番避けやすい",
        en: "Frank's high-charged ultimate has a fixed direction, and directly below is the easiest to dodge",
        ko: "프랑켄의 하이차지 궁극기는 방향이 정해져 있으며, 바로 아래가 가장 피하기 쉽습니다",
        ar: "قدرة فرانك النهائية عالية الشحن لها اتجاه ثابت، والأسفل مباشرة هو الأسهل للتفادي",
        fr: "L'ultimate surcharge de Frank a une direction fixe, et directement en dessous est le plus facile à esquiver",
        es: "La definitiva de alta carga de Frank tiene una dirección fija, y directamente por debajo es lo más fácil de esquivar",
        zhTw: "法蘭克的高充能終極技能方向是固定的，從正下方最容易迴避"
      }
    },
    {
      id: 19,
      title: {
        ja: "ダリルのウルトのチャージ速度",
        en: "Darryl's Ultimate Charge Speed",
        ko: "대릴의 궁극기 충전 속도",
        ar: "سرعة شحن قدرة داريل النهائية",
        fr: "Vitesse de Charge de l'Ultimate de Darryl",
        es: "Velocidad de Carga de la Definitiva de Darryl",
        zhTw: "達利爾的終極技能充能速度"
      },
      content: {
        ja: "ダリルのウルトは何もしないと30秒で自動で溜まる",
        en: "Darryl's ultimate charges automatically in 30 seconds if you do nothing",
        ko: "대릴의 궁극기는 아무것도 하지 않으면 30초 후에 자동으로 충전됩니다",
        ar: "تشحن قدرة داريل النهائية تلقائيًا في 30 ثانية إذا لم تفعل شيئًا",
        fr: "L'ultimate de Darryl se charge automatiquement en 30 secondes si vous ne faites rien",
        es: "La definitiva de Darryl se carga automáticamente en 30 segundos si no haces nada",
        zhTw: "達利爾的終極技能在不做任何事的情況下會在30秒內自動充滿"
      }
    },
    {
      id: 20,
      title: {
        ja: "アッシュの怒りゲージ",
        en: "Ash's Rage Gauge",
        ko: "애쉬의 분노 게이지",
        ar: "مقياس غضب آش",
        fr: "Jauge de Rage d'Ash",
        es: "Medidor de Rabia de Ash",
        zhTw: "艾許的憤怒值"
      },
      content: {
        ja: "アッシュは自分が無敵状態だと怒りゲージは溜まらない",
        en: "Ash's rage gauge does not fill up when he is invincible",
        ko: "애쉬는 자신이 무적 상태일 때 분노 게이지가 차지 않습니다",
        ar: "لا يمتلئ مقياس غضب آش عندما يكون غير قابل للإصابة",
        fr: "La jauge de rage d'Ash ne se remplit pas quand il est invincible",
        es: "El medidor de rabia de Ash no se llena cuando está invencible",
        zhTw: "艾許在無敵狀態時憤怒值不會增加"
      }
    },
    {
      id: 21,
      title: {
        ja: "ストゥーの必殺技の向き",
        en: "Stu's Ultimate",
        ko: "스투의 궁극기",
        ar: "قدرة ستو النهائية",
        fr: "L'Ultimate de Stu",
        es: "Definitiva de Stu",
        zhTw: "史杜的終極技能"
      },
      content: {
        ja: "ストゥーの必殺技はオートエイムで向いている方向に放たれるためエイムする必要がない",
        en: "Stu's ultimate is fired in the direction you are aiming with auto-aim, so you don't need to aim",
        ko: "스투의 궁극기는 자동 조준으로 조준하고 있는 방향으로 발사되므로 조준할 필요가 없습니다",
        ar: "تنطلق قدرة ستو النهائية في الاتجاه الذي تصوب إليه مع التصويب التلقائي، لذلك لا تحتاج للتصويب",
        fr: "L'ultimate de Stu est tiré dans la direction où vous visez avec l'auto-visée, donc vous n'avez pas besoin de viser",
        es: "La definitiva de Stu se dispara en la dirección a la que apuntas con auto-apuntado, así que no necesitas apuntar",
        zhTw: "史杜的終極技能會朝自動瞄準的方向發射，所以不需要額外瞄準"
      }
    }
];

const headerText: LocalizedText = {
  ja: '今日の豆知識',
  en: "Today's Tip",
  ko: '오늘의 팁',
  ar: 'نصيحة اليوم',
  fr: "Astuce du jour",
  es: "Consejo del día",
  zhTw: '今日小提示'
};

export const DailyTip: React.FC = () => {
  // 残りのコンポーネントコードは変更なし
  const [currentLanguage, setCurrentLanguage] = useState<keyof LocalizedText>('ja');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLanguage = async () => {
      try {
        setIsLoading(true);
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in headerText)) {
          setCurrentLanguage(savedLanguage as keyof LocalizedText);
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in headerText)) {
          setCurrentLanguage(savedLanguage as keyof LocalizedText);
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