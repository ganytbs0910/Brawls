interface IconMapping {
  [key: string]: {
    [key: number]: any;
  };
}

interface GearInfo {
  id: number;
  name: string;
  icon: any;
  description: string;
  type: 'superrare' | 'epic' | 'mythic' | 'plus';
}

interface GearData {
  id: number;
  name: {
    ja: string;
    en: string;
    ko: string;
    es: string;
    ar: string;
    fr: string;
    zhTw: string;
  };
  icon: any;
  description: {
    ja: string;
    en: string;
    ko: string;
    es: string;
    ar: string;
    fr: string;
    zhTw: string;
  };
  type: 'superrare' | 'epic' | 'mythic' | 'plus';
}

const gearData = {
  superrareGears: {
    speed: {
      id: 1,
      name: {
        ja: "スピードギア",
        en: "Speed Gear",
        ko: "스피드 기어",
        es: "Engranaje de Velocidad",
        ar: "ترس السرعة",
        fr: "Engrenage de Vitesse",
        zhTw: "速度齒輪"
      },
      icon: require('../../assets/GearIcon/gear_superrare_speed.png'),
      description: {
        ja: "やぶの中を移動する際のスピードが15%上昇する。",
        en: "Increases movement speed in bushes by 15%.",
        ko: "수풀 속에서 이동 속도가 15% 증가합니다.",
        es: "Aumenta la velocidad de movimiento en arbustos en un 15%.",
        ar: "يزيد من سرعة الحركة في الأدغال بنسبة 15٪.",
        fr: "Augmente la vitesse de déplacement dans les buissons de 15%.",
        zhTw: "在草叢中移動速度提升15%。"
      },
      type: "superrare"
    },
    vision: {
      id: 2,
      name: {
        ja: "ビジョンギア",
        en: "Vision Gear",
        ko: "비전 기어",
        es: "Engranaje de Visión",
        ar: "ترس الرؤية",
        fr: "Engrenage de Vision",
        zhTw: "視野齒輪"
      },
      icon: require('../../assets/GearIcon/gear_superrare_vision.png'),
      description: {
        ja: "敵にダメージを与えると、その敵の姿が2秒間見えるようになる。",
        en: "When you deal damage to an enemy, you can see them for 2 seconds.",
        ko: "적에게 데미지를 주면 해당 적을 2초 동안 볼 수 있습니다.",
        es: "Cuando infliges daño a un enemigo, puedes verlo durante 2 segundos.",
        ar: "عند إلحاق الضرر بعدو، يمكنك رؤيته لمدة ثانيتين.",
        fr: "Lorsque vous infligez des dégâts à un ennemi, vous pouvez le voir pendant 2 secondes.",
        zhTw: "對敵人造成傷害時，可以看見該敵人2秒。"
      },
      type: "superrare"
    },
    heal: {
      id: 3,
      name: {
        ja: "ヒールギア",
        en: "Heal Gear",
        ko: "힐 기어",
        es: "Engranaje de Curación",
        ar: "ترس الشفاء",
        fr: "Engrenage de Soin",
        zhTw: "治療齒輪"
      },
      icon: require('../../assets/GearIcon/gear_superrare_heal.png'),
      description: {
        ja: "HPを50%効率的に回復する。",
        en: "Heal HP 50% more efficiently.",
        ko: "HP를 50% 더 효율적으로 회복합니다.",
        es: "Cura PS un 50% más eficientemente.",
        ar: "يشفي نقاط الصحة بكفاءة أعلى بنسبة 50٪.",
        fr: "Soigne les PV 50% plus efficacement.",
        zhTw: "生命值恢復效率提升50%。"
      },
      type: "superrare"
    },
    shield: {
      id: 4,
      name: {
        ja: "シールドギア",
        en: "Shield Gear",
        ko: "실드 기어",
        es: "Engranaje de Escudo",
        ar: "ترس الدرع",
        fr: "Engrenage de Bouclier",
        zhTw: "護盾齒輪"
      },
      icon: require('../../assets/GearIcon/gear_superrare_shield.png'),
      description: {
        ja: "消費型のシールドとして最大HPを900増強する。キャラクターのHPが満タンになると、10秒後にシールドが全回復する。",
        en: "Increases maximum HP by 900 as a consumable shield. When character's HP is full, shield fully recovers after 10 seconds.",
        ko: "소모성 실드로 최대 HP를 900 증가시킵니다. 캐릭터의 HP가 최대가 되면 10초 후에 실드가 완전히 회복됩니다.",
        es: "Aumenta los PS máximos en 900 como escudo consumible. Cuando los PS del personaje están llenos, el escudo se recupera por completo después de 10 segundos.",
        ar: "يزيد الحد الأقصى لنقاط الصحة بمقدار 900 كدرع قابل للاستهلاك. عندما تكون نقاط صحة الشخصية كاملة، يتم استعادة الدرع بالكامل بعد 10 ثوانٍ.",
        fr: "Augmente les PV maximum de 900 sous forme de bouclier consommable. Lorsque les PV du personnage sont pleins, le bouclier se régénère complètement après 10 secondes.",
        zhTw: "增加900點最大生命值作為消耗性護盾。角色生命值滿時，護盾在10秒後完全恢復。"
      },
      type: "superrare"
    },
    damage: {
      id: 5,
      name: {
        ja: "ダメージギア",
        en: "Damage Gear",
        ko: "데미지 기어",
        es: "Engranaje de Daño",
        ar: "ترس الضرر",
        fr: "Engrenage de Dégâts",
        zhTw: "傷害齒輪"
      },
      icon: require('../../assets/GearIcon/gear_superrare_damage.png'),
      description: {
        ja: "HPが50％未満になると敵に与えるダメージが15%増加する。",
        en: "When HP falls below 50%, damage dealt increases by 15%.",
        ko: "HP가 50% 미만일 때 적에게 주는 데미지가 15% 증가합니다.",
        es: "Cuando los PS caen por debajo del 50%, el daño infligido aumenta un 15%.",
        ar: "عندما تنخفض نقاط الصحة عن 50٪، يزداد الضرر الذي تلحقه بنسبة 15٪.",
        fr: "Lorsque les PV tombent en dessous de 50%, les dégâts infligés augmentent de 15%.",
        zhTw: "生命值低於50%時，造成的傷害提升15%。"
      },
      type: "superrare"
    },
    gadget: {
      id: 6,
      name: {
        ja: "ガジェットクールダウンギア",
        en: "Gadget CoolDown Gear",
        ko: "가젯 강화 기어",
        es: "Engranaje de Mejora de Gadget",
        ar: "ترس تعزيز الأداة",
        fr: "Engrenage d'Amélioration de Gadget",
        zhTw: "道具強化齒輪"
      },
      icon: require('../../assets/GearIcon/gear_plus_gadgets.png'),
      description: {
        ja: "ガジェットのクールダウンが15%短縮される。",
        en: "Increases the number of times you can use gadgets in battle by 1.",
        ko: "배틀 중 가젯을 사용할 수 있는 횟수가 1회 증가합니다.",
        es: "Aumenta en 1 el número de veces que puedes usar gadgets en batalla.",
        ar: "يزيد عدد مرات استخدام الأدوات في المعركة بمقدار مرة واحدة.",
        fr: "Augmente d'une fois le nombre d'utilisations des gadgets en combat.",
        zhTw: "戰鬥中可使用道具的次數增加1次。"
      },
      type: "plus"
    }
  },
  epicGears: {
    pet: {
      id: 7,
      name: {
        ja: "ペット強化ギア",
        en: "Pet Boost Gear",
        ko: "펫 강화 기어",
        es: "Engranaje de Mejora de Mascota",
        ar: "ترس تعزيز الحيوان الأليف",
        fr: "Engrenage d'Amélioration d'Animal",
        zhTw: "寵物強化齒輪"
      },
      icon: require('../../assets/GearIcon/gear_epic_pet.png'),
      description: {
        ja: "ペットのパワーが25%増加する。",
        en: "Increases pet power by 25%.",
        ko: "펫의 파워가 25% 증가합니다.",
        es: "Aumenta el poder de la mascota en un 25%.",
        ar: "يزيد قوة الحيوان الأليف بنسبة 25٪.",
        fr: "Augmente la puissance de l'animal de 25%.",
        zhTw: "寵物能力提升25%。"
      },
      type: "epic"
    },
    reload: {
      id: 7,
      name: {
        ja: "リロード強化ギア",
        en: "Reload Boost Gear",
        ko: "리로드 강화 기어",
        es: "Engranaje de Mejora de Recarga",
        ar: "ترس تعزيز إعادة التحميل",
        fr: "Engrenage d'Amélioration de Rechargement",
        zhTw: "裝填強化齒輪"
      },
      icon: require('../../assets/GearIcon/gear_epic_reload.png'),
      description: {
        ja: "リロード速度が15%上昇する。",
        en: "Increases reload speed by 15%.",
        ko: "리로드 속도가 15% 증가합니다.",
        es: "Aumenta la velocidad de recarga en un 15%.",
        ar: "يزيد سرعة إعادة التحميل بنسبة 15٪.",
        fr: "Augmente la vitesse de rechargement de 15%.",
        zhTw: "裝填速度提升15%。"
      },
      type: "epic"
    },
    super: {
      id: 7,
      name: {
        ja: "スーパー強化ギア",
        en: "Super Boost Gear",
        ko: "슈퍼 강화 기어",
        es: "Engranaje de Mejora de Super",
        ar: "ترس تعزيز السوبر",
        fr: "Engrenage d'Amélioration de Super",
        zhTw: "超級強化齒輪"
      },
      icon: require('../../assets/GearIcon/gear_epic_super.png'),
      description: {
        ja: "必殺技のチャージ速度が10%上昇する。",
        en: "Increases Super charge rate by 10%.",
        ko: "궁극기 차지 속도가 10% 증가합니다.",
        es: "Aumenta la velocidad de carga del Super en un 10%.",
        ar: "يزيد معدل شحن السوبر بنسبة 10٪.",
        fr: "Augmente la vitesse de charge du Super de 10%.",
        zhTw: "超級技能充能速度提升10%。"
      },
      type: "epic"
    }
  },
  mythicGears: {
    tick: {
      id: 7,
      name: {
        ja: "ティック専用ギア",
        en: "Tick's Gear",
        ko: "틱 전용 기어",
        es: "Engranaje de Tick",
        ar: "ترس تيك",
        fr: "Engrenage de Tick",
        zhTw: "滴答專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_tick.png'),
      description: {
        ja: "ティックの頭に1000HPを追加で付与する。",
        en: "Adds 1000 HP to Tick's head.",
        ko: "틱의 머리에 1000HP를 추가로 부여합니다.",
        es: "Añade 1000 PS a la cabeza de Tick.",
        ar: "يضيف 1000 نقطة صحة لرأس تيك.",
        fr: "Ajoute 1000 PV à la tête de Tick.",
        zhTw: "為滴答的頭增加1000生命值。"
      },
      type: "mythic"
    },
    pam: {
      id: 7,
      name: {
        ja: "パム専用ギア",
        en: "Pam's Gear",
        ko: "팸 전용 기어",
        es: "Engranaje de Pam",
        ar: "ترس بام",
        fr: "Engrenage de Pam",
        zhTw: "帕姆專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_pam.png'),
      description: {
        ja: "タレットによる回復量が20%上昇する。",
        en: "Increases healing from turret by 20%.",
        ko: "터렛의 회복량이 20% 증가합니다.",
        es: "Aumenta la curación de la torreta en un 20%.",
        ar: "يزيد الشفاء من البرج بنسبة 20٪.",
        fr: "Augmente les soins de la tourelle de 20%.",
        zhTw: "砲塔的治療量提升20%。"
      },
      type: "mythic"
    },
    mortis: {
      id: 7,
      name: {
        ja: "モーティス専用ギア",
        en: "Mortis' Gear",
        ko: "모티스 전용 기어",
        es: "Engranaje de Mortis",
        ar: "ترس مورتيس",
        fr: "Engrenage de Mortis",
        zhTw: "莫提斯專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_mortis.png'),
      description: {
        ja: "コウモリのスピードが50%増加する。",
        en: "Increases bat speed by 50%.",
        ko: "박쥐의 속도가 50% 증가합니다.",
        es: "Aumenta la velocidad del murciélago en un 50%.",
        ar: "يزيد سرعة الخفاش بنسبة 50٪.",
        fr: "Augmente la vitesse des chauves-souris de 50%.",
        zhTw: "蝙蝠速度提升50%。"
      },
      type: "mythic"
    },
    gene: {
      id: 7,
      name: {
        ja: "ジーン専用ギア",
        en: "Gene's Gear",
        ko: "진 전용 기어",
        es: "Engranaje de Gene",
        ar: "ترس جين",
        fr: "Engrenage de Gene",
        zhTw: "吉恩專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_gene.png'),
      description: {
        ja: "ジーンの魔法の手の射程が伸びる。",
        en: "Increases the range of Gene's Magic Hand.",
        ko: "진의 마법의 손 사거리가 증가합니다.",
        es: "Aumenta el alcance de la Mano Mágica de Gene.",
        ar: "يزيد مدى يد جين السحرية.",
        fr: "Augmente la portée de la Main Magique de Gene.",
        zhTw: "增加吉恩魔法之手的射程。"
      },
      type: "mythic"
    },
    eve: {
      id: 8,
      name: {
        ja: "イヴ専用ギア",
        en: "Eve's Gear",
        ko: "이브 전용 기어",
        es: "Engranaje de Eve",
        ar: "ترس إيف",
        fr: "Engrenage d'Eve",
        zhTw: "伊芙專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_eve.png'),
      description: {
        ja: "必殺技で生まれるベビーが1匹増加する。",
        en: "Spawns one additional baby with Super.",
        ko: "궁극기로 태어나는 아기가 1마리 증가합니다.",
        es: "Genera un bebé adicional con el Super.",
        ar: "يولد طفلاً إضافياً مع السوبر.",
        fr: "Fait apparaître un bébé supplémentaire avec le Super.",
        zhTw: "超級技能多生成一隻寶寶。"
      },
      type: "mythic"
    },
    spike: {
      id: 7,
      name: {
        ja: "スパイク専用ギア",
        en: "Spike's Gear",
        ko: "스파이크 전용 기어",
        es: "Engranaje de Spike",
        ar: "ترس سبايك",
        fr: "Engrenage de Spike",
        zhTw: "仙人掌專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_spike.png'),
      description: {
        ja: "必殺技のスローダウン効果が30％向上する。",
        en: "Increases Super's slow effect by 30%.",
        ko: "궁극기의 슬로우 효과가 30% 증가합니다.",
        es: "Aumenta el efecto de ralentización del Super en un 30%.",
        ar: "يزيد تأثير إبطاء السوبر بنسبة 30٪.",
        fr: "Augmente l'effet de ralentissement du Super de 30%.",
        zhTw: "超級技能的減速效果提升30%。"
      },
      type: "mythic"
    },
    crow: {
      id: 7,
      name: {
        ja: "クロウ専用ギア",
        en: "Crow's Gear",
        ko: "크로우 전용 기어",
        es: "Engranaje de Crow",
        ar: "ترس كرو",
        fr: "Engrenage de Crow",
        zhTw: "烏鴉專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_crow.png'),
      description: {
        ja: "クロウの毒のダメージが30%増加する。",
        en: "Increases Crow's poison damage by 30%.",
        ko: "크로우의 독 데미지가 30% 증가합니다.",
        es: "Aumenta el daño por veneno de Crow en un 30%.",
        ar: "يزيد ضرر سم كرو بنسبة 30٪.",
        fr: "Augmente les dégâts du poison de Crow de 30%.",
        zhTw: "烏鴉的毒素傷害提升30%。"
      },
      type: "mythic"
    },
    leon: {
      id: 7,
      name: {
        ja: "レオン専用ギア",
        en: "Leon's Gear",
        ko: "레온 전용 기어",
        es: "Engranaje de Leon",
        ar: "ترس ليون",
        fr: "Engrenage de Léon",
        zhTw: "里昂專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_leon.png'),
      description: {
        ja: "必殺技の効果時間を2秒延長する。",
        en: "Extends Super duration by 2 seconds.",
        ko: "궁극기 지속 시간이 2초 연장됩니다.",
        es: "Extiende la duración del Super por 2 segundos.",
        ar: "يمدد مدة السوبر لثانيتين.",
        fr: "Prolonge la durée du Super de 2 secondes.",
        zhTw: "超級技能持續時間延長2秒。"
      },
      type: "mythic"
    },
    sandy: {
      id: 7,
      name: {
        ja: "サンディ専用ギア",
        en: "Sandy's Gear",
        ko: "샌디 전용 기어",
        es: "Engranaje de Sandy",
        ar: "ترس ساندي",
        fr: "Engrenage de Sandy",
        zhTw: "桑迪專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_sandy.png'),
      description: {
        ja: "砂嵐内にいる敵のダメージ量を20%減少させる。",
        en: "Reduces damage dealt by enemies in sandstorm by 20%.",
        ko: "모래폭풍 안에 있는 적의 데미지량이 20% 감소합니다.",
        es: "Reduce el daño causado por enemigos en la tormenta de arena en un 20%.",
        ar: "يقلل الضرر الذي يسببه الأعداء في العاصفة الرملية بنسبة 20٪.",
        fr: "Réduit les dégâts infligés par les ennemis dans la tempête de sable de 20%.",
        zhTw: "降低沙暴中敵人造成的傷害20%。"
      },
      type: "mythic"
    },
    amber: {
      id: 8,
      name: {
        ja: "アンバー専用ギア",
        en: "Amber's Gear",
        ko: "앰버 전용 기어",
        es: "Engranaje de Amber",
        ar: "ترس آمبر",
        fr: "Engrenage d'Amber",
        zhTw: "安珀專屬齒輪"
      },
      icon: require('../../assets/GearIcon/gear_mythic_amber.png'),
      description: {
        ja: "燃料で敵の動きが10%スローダウンする。",
        en: "Slows enemy movement by 10% with oil.",
        ko: "기름으로 적의 이동 속도가 10% 감소합니다.",
        es: "Ralentiza el movimiento del enemigo un 10% con aceite.",
        ar: "يبطئ حركة العدو بنسبة 10٪ بالزيت.",
        fr: "Ralentit les mouvements ennemis de 10% avec l'huile.",
        zhTw: "用油減緩敵人移動速度10%。"
      },
      type: "mythic"
    }
  }
};

export const getGearInfo = (characterName: string, index: number, language: Language = 'ja'): GearInfo => {
  const gear = gearIcons[characterName]?.[index] || gearData.superrareGears.speed;
  return {
    ...gear,
    name: gear.name[language],
    description: gear.description[language]
  };
};

export const getGearTypeColor = (type: GearInfo['type']): string => {
  switch (type) {
    case 'superrare': return '#5C9DFF';
    case 'epic': return '#FF8BFF';
    case 'mythic': return '#FF6B6B';
    default: return '#5C9DFF';
  }
};

export const getStarPowerIcon = (characterName: string, index: number) => {
  return starPowerIcons[characterName]?.[index + 1] || starPowerIcons["シェリー"][1];
};

export const getGadgetIcon = (characterName: string, index: number) => {
  return gadgetIcons[characterName]?.[index + 1] || gadgetIcons["シェリー"][1];
};

export const getGearIcon = (characterName: string, index: number) => {
  return gearIcons[characterName]?.[index] || gearIcons["シェリー"][1];
};

export const starPowerIcons: IconMapping = {
  "シェリー": {
  1: require('../../assets/StarPowerIcon/shelly_starpower_01.png'),
  2: require('../../assets/StarPowerIcon/shelly_starpower_02.png')
  },
  "ニタ": {
    1: require('../../assets/StarPowerIcon/nita_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/nita_starpower_02.png')
  },
  "コルト": {
    1: require('../../assets/StarPowerIcon/colt_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/colt_starpower_02.png')
  },
  "ブル": {
    1: require('../../assets/StarPowerIcon/bull_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/bull_starpower_02.png')
  },
  "ブロック": {
    1: require('../../assets/StarPowerIcon/brock_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/brock_starpower_02.png')
  },
  "エルプリモ": {
    1: require('../../assets/StarPowerIcon/elprimo_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/elprimo_starpower_02.png')
  },
  "バーリー": {
    1: require('../../assets/StarPowerIcon/barley_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/barley_starpower_02.png')
  },
  "ポコ": {
    1: require('../../assets/StarPowerIcon/poco_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/poco_starpower_02.png')
  },
  "ローサ": {
    1: require('../../assets/StarPowerIcon/rosa_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/rosa_starpower_02.png')
  },
  "ジェシー": {
    1: require('../../assets/StarPowerIcon/jessie_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/jessie_starpower_02.png')
  },
  "ダイナマイク": {
    1: require('../../assets/StarPowerIcon/dynamike_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/dynamike_starpower_02.png')
  },
  "ティック": {
    1: require('../../assets/StarPowerIcon/tick_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/tick_starpower_02.png')
  },
  "8ビット": {
    1: require('../../assets/StarPowerIcon/8bit_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/8bit_starpower_02.png')
  },
  "リコ": {
    1: require('../../assets/StarPowerIcon/rico_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/rico_starpower_02.png')
  },
  "ダリル": {
    1: require('../../assets/StarPowerIcon/darryl_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/darryl_starpower_02.png')
  },
  "ペニー": {
    1: require('../../assets/StarPowerIcon/penny_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/penny_starpower_02.png')
  },
  "カール": {
    1: require('../../assets/StarPowerIcon/carl_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/carl_starpower_02.png')
  },
  "ジャッキー": {
    1: require('../../assets/StarPowerIcon/jacky_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/jacky_starpower_02.png')
  },
  "ガス": {
    1: require('../../assets/StarPowerIcon/gus_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/gus_starpower_02.png')
  },
  "ボウ": {
    1: require('../../assets/StarPowerIcon/bo_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/bo_starpower_02.png')
  },
  "Emz": {
    1: require('../../assets/StarPowerIcon/emz_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/emz_starpower_02.png')
  },
  "ストゥー": {
    1: require('../../assets/StarPowerIcon/stu_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/stu_starpower_02.png')
  },
  "エリザベス": {
    1: require('../../assets/StarPowerIcon/piper_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/piper_starpower_02.png')
  },
  "パム": {
    1: require('../../assets/StarPowerIcon/pam_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/pam_starpower_02.png')
  },
  "フランケン": {
    1: require('../../assets/StarPowerIcon/frank_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/frank_starpower_02.png')
  },
  "ビビ": {
    1: require('../../assets/StarPowerIcon/bibi_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/bibi_starpower_02.png')
  },
  "ビー": {
    1: require('../../assets/StarPowerIcon/bea_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/bea_starpower_02.png')
  },
  "ナーニ": {
    1: require('../../assets/StarPowerIcon/nani_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/nani_starpower_02.png')
  },
  "エドガー": {
    1: require('../../assets/StarPowerIcon/edgar_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/edgar_starpower_02.png')
  },
  "グリフ": {
    1: require('../../assets/StarPowerIcon/griff_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/griff_starpower_02.png')
  },
  "グロム": {
    1: require('../../assets/StarPowerIcon/grom_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/grom_starpower_02.png')
  },
  "ボニー": {
    1: require('../../assets/StarPowerIcon/bonnie_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/bonnie_starpower_02.png')
  },
  "ゲイル": {
    1: require('../../assets/StarPowerIcon/gale_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/gale_starpower_02.png')
  },
  "コレット": {
    1: require('../../assets/StarPowerIcon/colette_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/colette_starpower_02.png')
  },
  "ベル": {
    1: require('../../assets/StarPowerIcon/belle_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/belle_starpower_02.png')
  },
  "アッシュ": {
    1: require('../../assets/StarPowerIcon/ash_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/ash_starpower_02.png')
  },
  "ローラ": {
    1: require('../../assets/StarPowerIcon/lola_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/lola_starpower_02.png')
  },
  "サム": {
    1: require('../../assets/StarPowerIcon/sam_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/sam_starpower_02.png')
  },
  "マンディ": {
    1: require('../../assets/StarPowerIcon/mandy_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/mandy_starpower_02.png')
  },
  "メイジー": {
    1: require('../../assets/StarPowerIcon/maisie_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/maisie_starpower_02.png')
  },
  "ハンク": {
    1: require('../../assets/StarPowerIcon/hank_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/hank_starpower_02.png')
  },
  "パール": {
    1: require('../../assets/StarPowerIcon/pearl_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/pearl_starpower_02.png')
  },
  "ラリー&ローリー": {
    1: require('../../assets/StarPowerIcon/larry_lawrie_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/larry_lawrie_starpower_02.png')
  },
  "アンジェロ": {
    1: require('../../assets/StarPowerIcon/angelo_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/angelo_starpower_02.png')
  },
  "ベリー": {
    1: require('../../assets/StarPowerIcon/berry_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/berry_starpower_02.png')
  },
  "シェイド": {
    1: require('../../assets/StarPowerIcon/shade_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/shade_starpower_02.png')
  },
  "モーティス": {
    1: require('../../assets/StarPowerIcon/mortis_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/mortis_starpower_02.png')
  },
  "タラ": {
    1: require('../../assets/StarPowerIcon/tara_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/tara_starpower_02.png')
  },
  "ジーン": {
    1: require('../../assets/StarPowerIcon/gene_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/gene_starpower_02.png')
  },
  "Max": {
    1: require('../../assets/StarPowerIcon/max_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/max_starpower_02.png')
  },
  "ミスターP": {
    1: require('../../assets/StarPowerIcon/mrp_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/mrp_starpower_02.png')
  },
  "スプラウト": {
    1: require('../../assets/StarPowerIcon/sprout_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/sprout_starpower_02.png')
  },
  "バイロン": {
    1: require('../../assets/StarPowerIcon/byron_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/byron_starpower_02.png')
  },
  "スクウィーク": {
    1: require('../../assets/StarPowerIcon/squeak_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/squeak_starpower_02.png')
  },
  "ルー": {
    1: require('../../assets/StarPowerIcon/lou_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/lou_starpower_02.png')
  },
  "ラフス": {
    1: require('../../assets/StarPowerIcon/ruffs_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/ruffs_starpower_02.png')
  },
  "バズ": {
    1: require('../../assets/StarPowerIcon/buzz_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/buzz_starpower_02.png')
  },
  "ファング": {
    1: require('../../assets/StarPowerIcon/fang_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/fang_starpower_02.png')
  },
  "イヴ": {
    1: require('../../assets/StarPowerIcon/eve_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/eve_starpower_02.png')
  },
  "ジャネット": {
    1: require('../../assets/StarPowerIcon/janet_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/janet_starpower_02.png')
  },
  "オーティス": {
    1: require('../../assets/StarPowerIcon/otis_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/otis_starpower_02.png')
  },
  "バスター": {
    1: require('../../assets/StarPowerIcon/buster_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/buster_starpower_02.png')
  },
  "グレイ": {
    1: require('../../assets/StarPowerIcon/gray_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/gray_starpower_02.png')
  },
  "R-T": {
    1: require('../../assets/StarPowerIcon/rt_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/rt_starpower_02.png')
  },
  "ウィロー": {
    1: require('../../assets/StarPowerIcon/willow_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/willow_starpower_02.png')
  },
  "ダグ": {
    1: require('../../assets/StarPowerIcon/doug_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/doug_starpower_02.png')
  },
  "チャック": {
    1: require('../../assets/StarPowerIcon/chuck_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/chuck_starpower_02.png')
  },
  "チャーリー": {
    1: require('../../assets/StarPowerIcon/charlie_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/charlie_starpower_02.png')
  },
  "ミコ": {
    1: require('../../assets/StarPowerIcon/mico_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/mico_starpower_02.png')
  },
  "メロディー": {
    1: require('../../assets/StarPowerIcon/melodie_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/melodie_starpower_02.png')
  },
  "リリー": {
    1: require('../../assets/StarPowerIcon/lily_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/lily_starpower_02.png')
  },
  "クランシー": {
    1: require('../../assets/StarPowerIcon/clancy_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/clancy_starpower_02.png')
  },
  "モー": {
    1: require('../../assets/StarPowerIcon/moe_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/moe_starpower_02.png')
  },
  "ジュジュ": {
    1: require('../../assets/StarPowerIcon/juju_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/juju_starpower_02.png')
  },
  "スパイク": {
    1: require('../../assets/StarPowerIcon/spike_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/spike_starpower_02.png')
  },
  "クロウ": {
    1: require('../../assets/StarPowerIcon/crow_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/crow_starpower_02.png')
  },
  "レオン": {
    1: require('../../assets/StarPowerIcon/leon_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/leon_starpower_02.png')
  },
  "サンディ": {
    1: require('../../assets/StarPowerIcon/sandy_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/sandy_starpower_02.png')
  },
  "アンバー": {
    1: require('../../assets/StarPowerIcon/amber_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/amber_starpower_02.png')
  },
  "メグ": {
    1: require('../../assets/StarPowerIcon/meg_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/meg_starpower_02.png')
  },
  "サージ": {
    1: require('../../assets/StarPowerIcon/surge_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/surge_starpower_02.png')
  },
  "チェスター": {
    1: require('../../assets/StarPowerIcon/chester_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/chester_starpower_02.png')
  },
  "コーデリアス": {
    1: require('../../assets/StarPowerIcon/cordelius_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/cordelius_starpower_02.png')
  },
  "キット": {
    1: require('../../assets/StarPowerIcon/kit_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/kit_starpower_02.png')
  },
  "ドラコ": {
    1: require('../../assets/StarPowerIcon/draco_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/draco_starpower_02.png')
  },
  "ケンジ": {
    1: require('../../assets/StarPowerIcon/kenji_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/kenji_starpower_02.png')
  },
  "ミープル": {
    1: require('../../assets/StarPowerIcon/meeple_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/meeple_starpower_02.png')
  },
  "オーリー": {
    1: require('../../assets/StarPowerIcon/ollie_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/ollie_starpower_02.png')
  },
  "フィンクス": {
    1: require('../../assets/StarPowerIcon/finx_starpower_01.png'),
    2: require('../../assets/StarPowerIcon/finx_starpower_02.png')
  },
};

export const gadgetIcons: IconMapping = {
    "シェリー": {
    1: require('../../assets/GadgetIcon/shelly_gadget_01.png'),
    2: require('../../assets/GadgetIcon/shelly_gadget_02.png')
  },
  "ニタ": {
    1: require('../../assets/GadgetIcon/nita_gadget_01.png'),
    2: require('../../assets/GadgetIcon/nita_gadget_02.png')
  },
  "コルト": {
    1: require('../../assets/GadgetIcon/colt_gadget_01.png'),
    2: require('../../assets/GadgetIcon/colt_gadget_02.png')
  },
  "ブル": {
    1: require('../../assets/GadgetIcon/bull_gadget_01.png'),
    2: require('../../assets/GadgetIcon/bull_gadget_02.png')
  },
  "ブロック": {
    1: require('../../assets/GadgetIcon/brock_gadget_01.png'),
    2: require('../../assets/GadgetIcon/brock_gadget_02.png')
  },
  "エルプリモ": {
    1: require('../../assets/GadgetIcon/elprimo_gadget_01.png'),
    2: require('../../assets/GadgetIcon/elprimo_gadget_02.png')
  },
  "バーリー": {
    1: require('../../assets/GadgetIcon/barley_gadget_01.png'),
    2: require('../../assets/GadgetIcon/barley_gadget_02.png')
  },
  "ポコ": {
    1: require('../../assets/GadgetIcon/poco_gadget_01.png'),
    2: require('../../assets/GadgetIcon/poco_gadget_02.png')
  },
  "ローサ": {
    1: require('../../assets/GadgetIcon/rosa_gadget_01.png'),
    2: require('../../assets/GadgetIcon/rosa_gadget_02.png')
  },
  "ジェシー": {
    1: require('../../assets/GadgetIcon/jessie_gadget_01.png'),
    2: require('../../assets/GadgetIcon/jessie_gadget_02.png')
  },
  "ダイナマイク": {
    1: require('../../assets/GadgetIcon/dynamike_gadget_01.png'),
    2: require('../../assets/GadgetIcon/dynamike_gadget_02.png')
  },
  "ティック": {
    1: require('../../assets/GadgetIcon/tick_gadget_01.png'),
    2: require('../../assets/GadgetIcon/tick_gadget_02.png')
  },
  "8ビット": {
    1: require('../../assets/GadgetIcon/8bit_gadget_01.png'),
    2: require('../../assets/GadgetIcon/8bit_gadget_02.png')
  },
  "リコ": {
    1: require('../../assets/GadgetIcon/rico_gadget_01.png'),
    2: require('../../assets/GadgetIcon/rico_gadget_02.png')
  },
  "ダリル": {
    1: require('../../assets/GadgetIcon/darryl_gadget_01.png'),
    2: require('../../assets/GadgetIcon/darryl_gadget_02.png')
  },
  "ペニー": {
    1: require('../../assets/GadgetIcon/penny_gadget_01.png'),
    2: require('../../assets/GadgetIcon/penny_gadget_02.png')
  },
  "カール": {
    1: require('../../assets/GadgetIcon/carl_gadget_01.png'),
    2: require('../../assets/GadgetIcon/carl_gadget_02.png')
  },
  "ジャッキー": {
    1: require('../../assets/GadgetIcon/jacky_gadget_01.png'),
    2: require('../../assets/GadgetIcon/jacky_gadget_02.png')
  },
  "ガス": {
    1: require('../../assets/GadgetIcon/gus_gadget_01.png'),
    2: require('../../assets/GadgetIcon/gus_gadget_02.png')
  },
  "ボウ": {
    1: require('../../assets/GadgetIcon/bo_gadget_01.png'),
    2: require('../../assets/GadgetIcon/bo_gadget_02.png')
  },
  "Emz": {
    1: require('../../assets/GadgetIcon/emz_gadget_01.png'),
    2: require('../../assets/GadgetIcon/emz_gadget_02.png')
  },
  "ストゥー": {
    1: require('../../assets/GadgetIcon/stu_gadget_01.png'),
    2: require('../../assets/GadgetIcon/stu_gadget_02.png')
  },
  "エリザベス": {
    1: require('../../assets/GadgetIcon/piper_gadget_01.png'),
    2: require('../../assets/GadgetIcon/piper_gadget_02.png')
  },
  "パム": {
    1: require('../../assets/GadgetIcon/pam_gadget_01.png'),
    2: require('../../assets/GadgetIcon/pam_gadget_02.png')
  },
  "フランケン": {
    1: require('../../assets/GadgetIcon/frank_gadget_01.png'),
    2: require('../../assets/GadgetIcon/frank_gadget_02.png')
  },
  "ビビ": {
    1: require('../../assets/GadgetIcon/bibi_gadget_01.png'),
    2: require('../../assets/GadgetIcon/bibi_gadget_02.png')
  },
  "ビー": {
    1: require('../../assets/GadgetIcon/bea_gadget_01.png'),
    2: require('../../assets/GadgetIcon/bea_gadget_02.png')
  },
  "ナーニ": {
    1: require('../../assets/GadgetIcon/nani_gadget_01.png'),
    2: require('../../assets/GadgetIcon/nani_gadget_02.png')
  },
  "エドガー": {
    1: require('../../assets/GadgetIcon/edgar_gadget_01.png'),
    2: require('../../assets/GadgetIcon/edgar_gadget_02.png')
  },
  "グリフ": {
    1: require('../../assets/GadgetIcon/griff_gadget_01.png'),
    2: require('../../assets/GadgetIcon/griff_gadget_02.png')
  },
  "グロム": {
    1: require('../../assets/GadgetIcon/grom_gadget_01.png'),
    2: require('../../assets/GadgetIcon/grom_gadget_02.png')
  },
  "ボニー": {
    1: require('../../assets/GadgetIcon/bonnie_gadget_01.png'),
    2: require('../../assets/GadgetIcon/bonnie_gadget_02.png')
  },
  "ゲイル": {
    1: require('../../assets/GadgetIcon/gale_gadget_01.png'),
    2: require('../../assets/GadgetIcon/gale_gadget_02.png')
  },
  "コレット": {
    1: require('../../assets/GadgetIcon/colette_gadget_01.png'),
    2: require('../../assets/GadgetIcon/colette_gadget_02.png')
  },
  "ベル": {
    1: require('../../assets/GadgetIcon/belle_gadget_01.png'),
    2: require('../../assets/GadgetIcon/belle_gadget_02.png')
  },
  "アッシュ": {
    1: require('../../assets/GadgetIcon/ash_gadget_01.png'),
    2: require('../../assets/GadgetIcon/ash_gadget_02.png')
  },
  "ローラ": {
    1: require('../../assets/GadgetIcon/lola_gadget_01.png'),
    2: require('../../assets/GadgetIcon/lola_gadget_02.png')
  },
  "サム": {
    1: require('../../assets/GadgetIcon/sam_gadget_01.png'),
    2: require('../../assets/GadgetIcon/sam_gadget_02.png')
  },
  "マンディ": {
    1: require('../../assets/GadgetIcon/mandy_gadget_01.png'),
    2: require('../../assets/GadgetIcon/mandy_gadget_02.png')
  },
  "メイジー": {
    1: require('../../assets/GadgetIcon/maisie_gadget_01.png'),
    2: require('../../assets/GadgetIcon/maisie_gadget_02.png')
  },
  "ハンク": {
    1: require('../../assets/GadgetIcon/hank_gadget_01.png'),
    2: require('../../assets/GadgetIcon/hank_gadget_02.png')
  },
  "パール": {
    1: require('../../assets/GadgetIcon/pearl_gadget_01.png'),
    2: require('../../assets/GadgetIcon/pearl_gadget_02.png')
  },
  "ラリー&ローリー": {
    1: require('../../assets/GadgetIcon/larry_lawrie_gadget_01.png'),
    2: require('../../assets/GadgetIcon/larry_lawrie_gadget_02.png')
  },
  "アンジェロ": {
    1: require('../../assets/GadgetIcon/angelo_gadget_01.png'),
    2: require('../../assets/GadgetIcon/angelo_gadget_02.png')
  },
  "ベリー": {
    1: require('../../assets/GadgetIcon/berry_gadget_01.png'),
    2: require('../../assets/GadgetIcon/berry_gadget_02.png')
  },
  "シェイド": {
    1: require('../../assets/GadgetIcon/shade_gadget_01.png'),
    2: require('../../assets/GadgetIcon/shade_gadget_02.png')
  },
  "モーティス": {
    1: require('../../assets/GadgetIcon/mortis_gadget_01.png'),
    2: require('../../assets/GadgetIcon/mortis_gadget_02.png')
  },
  "タラ": {
    1: require('../../assets/GadgetIcon/tara_gadget_01.png'),
    2: require('../../assets/GadgetIcon/tara_gadget_02.png')
  },
  "ジーン": {
    1: require('../../assets/GadgetIcon/gene_gadget_01.png'),
    2: require('../../assets/GadgetIcon/gene_gadget_02.png')
  },
  "Max": {
    1: require('../../assets/GadgetIcon/max_gadget_01.png'),
    2: require('../../assets/GadgetIcon/max_gadget_02.png')
  },
  "ミスターP": {
    1: require('../../assets/GadgetIcon/mrp_gadget_01.png'),
    2: require('../../assets/GadgetIcon/mrp_gadget_02.png')
  },
  "スプラウト": {
    1: require('../../assets/GadgetIcon/sprout_gadget_01.png'),
    2: require('../../assets/GadgetIcon/sprout_gadget_02.png')
  },
  "バイロン": {
    1: require('../../assets/GadgetIcon/byron_gadget_01.png'),
    2: require('../../assets/GadgetIcon/byron_gadget_02.png')
  },
  "スクウィーク": {
    1: require('../../assets/GadgetIcon/squeak_gadget_01.png'),
    2: require('../../assets/GadgetIcon/squeak_gadget_02.png')
  },
  "ルー": {
    1: require('../../assets/GadgetIcon/lou_gadget_01.png'),
    2: require('../../assets/GadgetIcon/lou_gadget_02.png')
  },
  "ラフス": {
    1: require('../../assets/GadgetIcon/ruffs_gadget_01.png'),
    2: require('../../assets/GadgetIcon/ruffs_gadget_02.png')
  },
  "バズ": {
    1: require('../../assets/GadgetIcon/buzz_gadget_01.png'),
    2: require('../../assets/GadgetIcon/buzz_gadget_02.png')
  },
  "ファング": {
    1: require('../../assets/GadgetIcon/fang_gadget_01.png'),
    2: require('../../assets/GadgetIcon/fang_gadget_02.png')
  },
  "イヴ": {
    1: require('../../assets/GadgetIcon/eve_gadget_01.png'),
    2: require('../../assets/GadgetIcon/eve_gadget_02.png')
  },
  "ジャネット": {
    1: require('../../assets/GadgetIcon/janet_gadget_01.png'),
    2: require('../../assets/GadgetIcon/janet_gadget_02.png')
  },
  "オーティス": {
    1: require('../../assets/GadgetIcon/otis_gadget_01.png'),
    2: require('../../assets/GadgetIcon/otis_gadget_02.png')
  },
  "バスター": {
    1: require('../../assets/GadgetIcon/buster_gadget_01.png'),
    2: require('../../assets/GadgetIcon/buster_gadget_02.png')
  },
  "グレイ": {
    1: require('../../assets/GadgetIcon/gray_gadget_01.png'),
    2: require('../../assets/GadgetIcon/gray_gadget_02.png')
  },
  "R-T": {
    1: require('../../assets/GadgetIcon/rt_gadget_01.png'),
    2: require('../../assets/GadgetIcon/rt_gadget_02.png')
  },
  "ウィロー": {
    1: require('../../assets/GadgetIcon/willow_gadget_01.png'),
    2: require('../../assets/GadgetIcon/willow_gadget_02.png')
  },
  "ダグ": {
    1: require('../../assets/GadgetIcon/doug_gadget_01.png'),
    2: require('../../assets/GadgetIcon/doug_gadget_02.png')
  },
  "チャック": {
    1: require('../../assets/GadgetIcon/chuck_gadget_01.png'),
    2: require('../../assets/GadgetIcon/chuck_gadget_02.png')
  },
  "チャーリー": {
    1: require('../../assets/GadgetIcon/charlie_gadget_01.png'),
    2: require('../../assets/GadgetIcon/charlie_gadget_02.png')
  },
  "ミコ": {
    1: require('../../assets/GadgetIcon/mico_gadget_01.png'),
    2: require('../../assets/GadgetIcon/mico_gadget_02.png')
  },
  "メロディー": {
    1: require('../../assets/GadgetIcon/melodie_gadget_01.png'),
    2: require('../../assets/GadgetIcon/melodie_gadget_02.png')
  },
  "リリー": {
    1: require('../../assets/GadgetIcon/lily_gadget_01.png'),
    2: require('../../assets/GadgetIcon/lily_gadget_02.png')
  },
  "クランシー": {
    1: require('../../assets/GadgetIcon/clancy_gadget_01.png'),
    2: require('../../assets/GadgetIcon/clancy_gadget_02.png')
  },
  "モー": {
    1: require('../../assets/GadgetIcon/moe_gadget_01.png'),
    2: require('../../assets/GadgetIcon/moe_gadget_02.png')
  },
  "ジュジュ": {
    1: require('../../assets/GadgetIcon/juju_gadget_01.png'),
    2: require('../../assets/GadgetIcon/juju_gadget_02.png')
  },
  "スパイク": {
    1: require('../../assets/GadgetIcon/spike_gadget_01.png'),
    2: require('../../assets/GadgetIcon/spike_gadget_02.png')
  },
  "クロウ": {
    1: require('../../assets/GadgetIcon/crow_gadget_01.png'),
    2: require('../../assets/GadgetIcon/crow_gadget_02.png')
  },
  "レオン": {
    1: require('../../assets/GadgetIcon/leon_gadget_01.png'),
    2: require('../../assets/GadgetIcon/leon_gadget_02.png')
  },
  "サンディ": {
    1: require('../../assets/GadgetIcon/sandy_gadget_01.png'),
    2: require('../../assets/GadgetIcon/sandy_gadget_02.png')
  },
  "アンバー": {
    1: require('../../assets/GadgetIcon/amber_gadget_01.png'),
    2: require('../../assets/GadgetIcon/amber_gadget_02.png')
  },
  "メグ": {
    1: require('../../assets/GadgetIcon/meg_gadget_01.png'),
    2: require('../../assets/GadgetIcon/meg_gadget_02.png')
  },
  "サージ": {
    1: require('../../assets/GadgetIcon/surge_gadget_01.png'),
    2: require('../../assets/GadgetIcon/surge_gadget_02.png')
  },
  "チェスター": {
    1: require('../../assets/GadgetIcon/chester_gadget_01.png'),
    2: require('../../assets/GadgetIcon/chester_gadget_02.png')
  },
  "コーデリアス": {
    1: require('../../assets/GadgetIcon/cordelius_gadget_01.png'),
    2: require('../../assets/GadgetIcon/cordelius_gadget_02.png')
  },
  "キット": {
    1: require('../../assets/GadgetIcon/kit_gadget_01.png'),
    2: require('../../assets/GadgetIcon/kit_gadget_02.png')
  },
  "ドラコ": {
    1: require('../../assets/GadgetIcon/draco_gadget_01.png'),
    2: require('../../assets/GadgetIcon/draco_gadget_02.png')
  },
  "ケンジ": {
    1: require('../../assets/GadgetIcon/kenji_gadget_01.png'),
    2: require('../../assets/GadgetIcon/kenji_gadget_02.png')
  },
  "ミープル": {
    1: require('../../assets/GadgetIcon/meeple_gadget_01.png'),
    2: require('../../assets/GadgetIcon/meeple_gadget_02.png')
  },
  "オーリー": {
    1: require('../../assets/GadgetIcon/ollie_gadget_01.png'),
    2: require('../../assets/GadgetIcon/ollie_gadget_02.png')
  },
  "フィンクス": {
    1: require('../../assets/GadgetIcon/finx_gadget_01.png'),
    2: require('../../assets/GadgetIcon/finx_gadget_02.png')
  },
};

export const gearIcons: IconMapping = {
  "シェリー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ニタ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.pet,
  },
  "コルト": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "ブル": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "ブロック": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "エルプリモ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "バーリー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ポコ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ローサ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ジェシー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.pet,
  },
  "ダイナマイク": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ティック": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.tick,
  },
  "8ビット": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "リコ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "ダリル": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ペニー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.pet,
  },
  "カール": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ジャッキー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "ガス": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ボウ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "Emz": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ストゥー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "エリザベス": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "パム": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.pam,
  },
  "フランケン": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ビビ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ビー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ナーニ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "エドガー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "グリフ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "グロム": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ボニー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "ゲイル": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "コレット": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ベル": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "アッシュ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "ローラ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
  },
  "サム": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "マンディ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "メイジー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ハンク": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "パール": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ラリー&ローリー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "アンジェロ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ベリー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "シェイド": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "モーティス": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.mortis,
  },
  "タラ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.pet,

  },
  "ジーン": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.gene,
  },
  "Max": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ミスターP": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.pet,
  },
  "スプラウト": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "バイロン": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "スクウィーク": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ルー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "ラフス": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "バズ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ファング": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "イヴ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
    8: gearData.mythicGears.eve,
  },
  "ジャネット": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "オーティス": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.super,
  },
  "バスター": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "グレイ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "R-T": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ウィロー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ダグ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "チャック": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "チャーリー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ミコ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "メロディー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "リリー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "クランシー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "モー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ジュジュ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "スパイク": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.spike,
  },
  "クロウ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.crow,
  },
  "レオン": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.leon,
  },
  "サンディ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.mythicGears.sandy,
  },
  "アンバー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
    7: gearData.epicGears.reload,
    8: gearData.mythicGears.amber,
  },
  "メグ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "サージ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "チェスター": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "コーデリアス": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "キット": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ドラコ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ケンジ": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "ミープル": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "オーリー": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
  "フィンクス": {
    1: gearData.superrareGears.speed,
    2: gearData.superrareGears.vision,
    3: gearData.superrareGears.heal,
    4: gearData.superrareGears.shield,
    5: gearData.superrareGears.damage,
    6: gearData.superrareGears.gadget,
  },
};