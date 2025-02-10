//iconMappings

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

const gearData = {
  superrareGears: {
    speed: {
      id: 1,
      name: "スピードギア",
      icon: require('../../assets/GearIcon/gear_superrare_speed.png'),
      description: "やぶの中を移動する際のスピードが15%上昇する。",
      type: "superrare"
    },
    vision: {
      id: 2,
      name: "ビジョンギア",
      icon: require('../../assets/GearIcon/gear_superrare_vision.png'),
      description: "敵にダメージを与えると、その敵の姿が2秒間見えるようになる。",
      type: "superrare"
    },
    heal: {
      id: 3,
      name: "ヒールギア",
      icon: require('../../assets/GearIcon/gear_superrare_heal.png'),
      description: "HPを50%効率的に回復する。",
      type: "superrare"
    },
    shield: {
      id: 4,
      name: "シールドギア",
      icon: require('../../assets/GearIcon/gear_superrare_shield.png'),
      description: "消費型のシールドとして最大HPを900増強する。キャラクターのHPが満タンになると、10秒後にシールドが全回復する。",
      type: "superrare"
    },
    damage: {
      id: 5,
      name: "ダメージギア",
      icon: require('../../assets/GearIcon/gear_superrare_damage.png'),
      description: "HPが50％未満になると敵に与えるダメージが15%増加する。",
      type: "superrare"
    },
    gadget: {
      id: 6,
      name: "ガジェット強化ギア",
      icon: require('../../assets/GearIcon/gear_plus_gadgets.png'),
      description: "バトル中にガジェットを使える回数が1回増える。",
      type: "plus"
    }
  },
  epicGears: {
    pet: {
      id: 7,
      name: "ペット強化ギア",
      icon: require('../../assets/GearIcon/gear_epic_pet.png'),
      description: "ペットのパワーが25%増加する。",
      type: "epic"
    },
    reload: {
      id: 7,
      name: "リロード強化ギア",
      icon: require('../../assets/GearIcon/gear_epic_reload.png'),
      description: "リロード速度が15%上昇する。",
      type: "epic"
    },
    super: {
      id: 7,
      name: "スーパー強化ギア",
      icon: require('../../assets/GearIcon/gear_epic_super.png'),
      description: "必殺技のチャージ速度が10%上昇する。",
      type: "epic"
    }
  },
  mythicGears: {
    tick: {
      id: 7,
      name: "ティック専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_tick.png'),
      description: "ティックの頭に1000HPを追加で付与する。",
      type: "mythic"
    },
    pam: {
      id: 7,
      name: "パム専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_pam.png'),
      description: "タレットによる回復量が20%上昇する。",
      type: "mythic"
    },
    mortis: {
      id: 7,
      name: "モーティス専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_mortis.png'),
      description: "コウモリのスピードが50%増加する。",
      type: "mythic"
    },
    gene: {
      id: 7,
      name: "ジーン専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_gene.png'),
      description: "ジーンの魔法の手の射程が伸びる。",
      type: "mythic"
    },
    eve: {
      id: 8,
      name: "イヴ専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_eve.png'),
      description: "必殺技で生まれるベビーが1匹増加する。",
      type: "mythic"
    },
    spike: {
      id: 7,
      name: "スパイク専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_spike.png'),
      description: "必殺技のスローダウン効果が30％向上する。",
      type: "mythic"
    },
    crow: {
      id: 7,
      name: "クロウ専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_crow.png'),
      description: "クロウの毒のダメージが30%増加する。",
      type: "mythic"
    },
    leon: {
      id: 7,
      name: "レオン専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_leon.png'),
      description: "必殺技の効果時間を2秒延長する。",
      type: "mythic"
    },
    sandy: {
      id: 7,
      name: "サンディ専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_sandy.png'),
      description: "砂嵐内にいる敵のダメージ量を20%減少させる。",
      type: "mythic"
    },
    amber: {
      id: 8,
      name: "アンバー専用ギア",
      icon: require('../../assets/GearIcon/gear_mythic_amber.png'),
      description: "燃料で敵の動きが10%スローダウンする。",
      type: "mythic"
    }
  }
};

export const getGearInfo = (characterName: string, index: number): GearInfo => {
  return gearIcons[characterName]?.[index] || gearData.superrareGears.speed;
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
  "MAX": {
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
  "MAX": {
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
  "MAX": {
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
};