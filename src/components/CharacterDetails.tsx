import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { getCharacterData } from '../data/characterData';
import CharacterImage from './CharacterImage';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;

// スターパワーアイコンの個別インポート
const starPowerIcons: { [key: string]: { [key: number]: any } } = {
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
  }
};

// ガジェットアイコンの個別インポート
const gadgetIcons: { [key: string]: { [key: number]: any } } = {
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
  }
};

const CharacterDetails: React.FC = () => {
  const route = useRoute<CharacterDetailsRouteProp>();
  const { characterName } = route.params;
  const character = getCharacterData(characterName);

  const getStarPowerIcon = (characterName: string, index: number) => {
    return starPowerIcons[characterName]?.[index + 1] || starPowerIcons["シェリー"][1];
  };

  const getGadgetIcon = (characterName: string, index: number) => {
    return gadgetIcons[characterName]?.[index + 1] || gadgetIcons["シェリー"][1];
  };

  const renderRecommendationLevel = (level?: number) => {
    if (!level) return null;
    
    const getRecommendationColor = (level: number) => {
      switch (level) {
        case 5: return '#4CAF50';
        case 4: return '#8BC34A';
        case 3: return '#FFC107';
        case 2: return '#FF9800';
        case 1: return '#F44336';
        default: return '#757575';
      }
    };

    return (
      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationLabel}>おすすめ度:</Text>
        <View style={[styles.recommendationBar, { backgroundColor: getRecommendationColor(level) }]}>
          <Text style={styles.recommendationText}>{level}/5</Text>
        </View>
      </View>
    );
  };

  if (!character) {
    return (
      <View style={styles.container}>
        <Text>キャラクターが見つかりませんでした。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <CharacterImage 
          characterName={characterName} 
          size={160} 
          style={styles.characterImage} 
        />
        <Text style={styles.name}>{character.name}</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>基本情報</Text>
          <View style={styles.basicInfo}>
            <Text style={styles.infoLabel}>役割: {character.role}</Text>
            <Text style={styles.infoLabel}>レアリティ: {character.rarity}</Text>
          </View>
        </View>

        {character.starPowers && character.starPowers.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>スターパワー</Text>
            {character.starPowers.map((starPower, index) => (
              <View key={index} style={styles.powerItem}>
                <View style={styles.powerHeader}>
                  <Image
                    source={getStarPowerIcon(character.name, index)}
                    style={styles.powerIcon}
                  />
                  <Text style={styles.skillName}>{starPower.name}</Text>
                </View>
                <Text style={styles.description}>{starPower.description}</Text>
                {renderRecommendationLevel(starPower.recommendationLevel)}
                {starPower.recommendationReason && (
                  <Text style={styles.recommendationReason}>{starPower.recommendationReason}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {character.gadgets && character.gadgets.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>ガジェット</Text>
            {character.gadgets.map((gadget, index) => (
              <View key={index} style={styles.powerItem}>
                <View style={styles.powerHeader}>
                  <Image
                    source={getGadgetIcon(character.name, index)}
                    style={styles.powerIcon}
                  />
                  <Text style={styles.skillName}>{gadget.name}</Text>
                </View>
                <Text style={styles.description}>{gadget.description}</Text>
                {renderRecommendationLevel(gadget.recommendationLevel)}
                {gadget.recommendationReason && (
                  <Text style={styles.recommendationReason}>{gadget.recommendationReason}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  characterImage: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
marginBottom: 12,
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  powerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  powerIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  recommendationContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationLabel: {
    fontSize: 14,
    marginRight: 8,
    color: '#666',
  },
  recommendationBar: {
    padding: 4,
    borderRadius: 4,
    minWidth: 40,
  },
  recommendationText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  recommendationReason: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  powerItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

export default CharacterDetails;