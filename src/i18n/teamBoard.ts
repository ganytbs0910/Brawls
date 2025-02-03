// src/i18n/teamBoard.ts

// 翻訳の型定義
export type TeamBoardTranslation = {
  boardTitle: string;
  refresh: string;
  create: string;
  cancel: string;
  submit: string;
  playerTag: string;
  tagDescription: string;
  tagPlaceholder: string;
  verify: string;
  change: string;
  searchHistory: string;
  modeSelection: string;
  useCharacter: string;
  midCharacters: string;
  sideCharacters: string;
  inviteLink: string;
  inviteLinkPlaceholder: string;
  comment: string;
  commentPlaceholder: string;
  errors: {
    selectMode: string;
    playerInfo: string;
    selectCharacter: string;
    invalidLink: string;
    enterTag: string;
    invalidTag: string;
    fetchFailed: string;
    maxMidChars: string;
    maxSideChars: string;
    refreshCooldown: string;
    refreshFailed: string;
    postCreationFailed: string;
  };
  success: {
    postCreated: string;
  };
  modes: {
    ranked: string;
    duoShowdown: string;
    gemGrab: string;
    brawlBall: string;
    heist: string;
    knockout: string;
    bounty: string;
    wipeout: string;
    hotZone: string;
    brawlBall5v5: string;
    wipeout5v5: string;
  };
};

// 日本語翻訳
export const ja: TeamBoardTranslation = {
  boardTitle: '募集掲示板',
  refresh: '更新',
  create: '募集する',
  cancel: 'キャンセル',
  submit: '投稿',
  playerTag: 'あなたのプレイヤータグ',
  tagDescription: '※このタグからホスト情報を補填しています。',
  tagPlaceholder: '#XXXXXXXXX',
  verify: '取得',
  change: '変更する',
  searchHistory: '検索履歴',
  modeSelection: 'モード選択',
  useCharacter: '使用キャラクター',
  midCharacters: 'ミッド募集キャラクター (最大3体)',
  sideCharacters: 'サイド募集キャラクター (最大3体)',
  inviteLink: '招待リンク',
  inviteLinkPlaceholder: '招待リンクを貼り付け',
  comment: 'コメント (任意)',
  commentPlaceholder: '募集に関する詳細や要望を入力',
  errors: {
    selectMode: 'モードを選択してください',
    playerInfo: 'プレイヤー情報を取得してください',
    selectCharacter: 'キャラクターを選択してください',
    invalidLink: '有効な招待リンクを入力してください',
    enterTag: 'プレイヤータグを入力してください',
    invalidTag: 'プレイヤータグが不正です',
    fetchFailed: 'プレイヤーデータの取得に失敗しました',
    maxMidChars: 'ミッドキャラは3体まで選択できます',
    maxSideChars: 'サイドキャラは3体まで選択できます',
    refreshCooldown: '更新は3秒後に可能になります',
    refreshFailed: '更新に失敗しました',
    postCreationFailed: '投稿の作成に失敗しました'
  },
  success: {
    postCreated: '投稿が作成されました'
  },
  modes: {
    ranked: 'ガチバトル',
    duoShowdown: 'デュオバトルロワイヤル',
    gemGrab: 'エメラルドハント',
    brawlBall: 'ブロストライカー',
    heist: '強奪',
    knockout: 'ノックアウト',
    bounty: '賞金稼ぎ',
    wipeout: '殲滅',
    hotZone: 'ホットゾーン',
    brawlBall5v5: '5vs5ブロストライカー',
    wipeout5v5: '5vs5殲滅'
  },
};

// 英語翻訳
export const en: TeamBoardTranslation = {
  boardTitle: 'Team Recruitment Board',
  refresh: 'Refresh',
  create: 'Create Post',
  cancel: 'Cancel',
  submit: 'Submit',
  playerTag: 'Your Player Tag',
  tagDescription: '* Host information will be filled from this tag.',
  tagPlaceholder: '#XXXXXXXXX',
  verify: 'Verify',
  change: 'Change',
  searchHistory: 'Search History',
  modeSelection: 'Select Mode',
  useCharacter: 'Your Character',
  midCharacters: 'Mid Characters (Max 3)',
  sideCharacters: 'Side Characters (Max 3)',
  inviteLink: 'Invite Link',
  inviteLinkPlaceholder: 'Paste invite link here',
  comment: 'Comment (Optional)',
  commentPlaceholder: 'Enter details or requirements',
  errors: {
    selectMode: 'Please select a mode',
    playerInfo: 'Please get player information',
    selectCharacter: 'Please select a character',
    invalidLink: 'Please enter a valid invite link',
    enterTag: 'Please enter a player tag',
    invalidTag: 'Invalid player tag',
    fetchFailed: 'Failed to fetch player data',
    maxMidChars: 'You can select up to 3 mid characters',
    maxSideChars: 'You can select up to 3 side characters',
    refreshCooldown: 'Refresh will be available in 3 seconds',
    refreshFailed: 'Failed to refresh',
    postCreationFailed: 'Failed to create post'
  },
  success: {
    postCreated: 'Post created successfully'
  },
  modes: {
    ranked: 'Ranked Battle',
    duoShowdown: 'Duo Showdown',
    gemGrab: 'Gem Grab',
    brawlBall: 'Brawl Ball',
    heist: 'Heist',
    knockout: 'Knockout',
    bounty: 'Bounty',
    wipeout: 'Wipeout',
    hotZone: 'Hot Zone',
    brawlBall5v5: '5v5 Brawl Ball',
    wipeout5v5: '5v5 Wipeout',
  },
};

// 韓国語翻訳
export const ko: TeamBoardTranslation = {
  boardTitle: '팀 모집 게시판',
  refresh: '새로고침',
  create: '모집하기',
  cancel: '취소',
  submit: '게시',
  playerTag: '플레이어 태그',
  tagDescription: '* 이 태그로 호스트 정보를 채웁니다.',
  tagPlaceholder: '#XXXXXXXXX',
  verify: '확인',
  change: '변경',
  searchHistory: '검색 기록',
  modeSelection: '모드 선택',
  useCharacter: '사용 캐릭터',
  midCharacters: '미드 캐릭터 (최대 3개)',
  sideCharacters: '사이드 캐릭터 (최대 3개)',
  inviteLink: '초대 링크',
  inviteLinkPlaceholder: '초대 링크를 붙여넣으세요',
  comment: '코멘트 (선택사항)',
  commentPlaceholder: '세부사항이나 요구사항을 입력하세요',
  errors: {
    selectMode: '모드를 선택해주세요',
    playerInfo: '플레이어 정보를 가져와주세요',
    selectCharacter: '캐릭터를 선택해주세요',
    invalidLink: '유효한 초대 링크를 입력해주세요',
    enterTag: '플레이어 태그를 입력해주세요',
    invalidTag: '잘못된 플레이어 태그입니다',
    fetchFailed: '플레이어 데이터를 가져오는데 실패했습니다',
    maxMidChars: '미드 캐릭터는 최대 3개까지 선택할 수 있습니다',
    maxSideChars: '사이드 캐릭터는 최대 3개까지 선택할 수 있습니다',
    refreshCooldown: '3초 후에 새로고침이 가능합니다',
    refreshFailed: '새로고침에 실패했습니다',
    postCreationFailed: '게시물 생성에 실패했습니다'
  },
  success: {
    postCreated: '게시물이 생성되었습니다'
  },
  modes: {
    ranked: '랭크 배틀',
    duoShowdown: '듀오 쇼다운',
    gemGrab: '젬 그랩',
    brawlBall: '브롤 볼',
    heist: '하이스트',
    knockout: '녹아웃',
    bounty: '바운티',
    wipeout: '와이프아웃',
    hotZone: '핫 존',
    brawlBall5v5: '5대5 브롤 볼',
    wipeout5v5: '5대5 와이프아웃'
  },
};

// 翻訳オブジェクトをまとめたもの
export const teamBoardTranslations = {
  ja,
  en,
  ko
} as const;

// 言語タイプの定義
export type Language = keyof typeof teamBoardTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useTeamBoardTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in teamBoardTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to get language setting:', error);
      }
    };

    getLanguage();

    // 言語設定の変更を監視
    const watchLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in teamBoardTranslations)) {
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
    t: teamBoardTranslations[currentLanguage],
    currentLanguage
  };
}