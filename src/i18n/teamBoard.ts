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
    postLimitTitle: string;
    postLimitPrefix: string;
    postLimitSuffix: string;
    minutes: string;
    seconds: string;
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
  boardTitle: 'チーム募集',
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
    postLimitTitle: '投稿制限',
    postLimitPrefix: '次の投稿まであと',
    postLimitSuffix: 'お待ちください',
    minutes: '分',
    seconds: '秒',
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
  boardTitle: 'Team Recruitment',
  refresh: 'Refresh',
  create: 'Create',
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
    postLimitTitle: 'Post Limit',
    postLimitPrefix: 'Please wait ',
    postLimitSuffix: ' before posting again',
    minutes: ' minutes',
    seconds: ' seconds',
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
  boardTitle: '팀 모집',
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
    postLimitTitle: '게시 제한',
    postLimitPrefix: '다음 게시까지 ',
    postLimitSuffix: ' 기다려주세요',
    minutes: '분',
    seconds: '초',
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
    ranked: '경쟁전',
    duoShowdown: '듀오 쇼다운',
    gemGrab: '젬 그랩',
    brawlBall: '브롤 볼',
    heist: '하이스트',
    knockout: '녹아웃',
    bounty: '바운티',
    wipeout: '클린 아웃',
    hotZone: '핫 존',
    brawlBall5v5: '5대5 브롤 볼',
    wipeout5v5: '5대5 클린 아웃'
  },
};

export const ar: TeamBoardTranslation = {
  boardTitle: 'تكوين الفريق',
  refresh: 'تحديث',
  create: 'إنشاء',
  cancel: 'إلغاء',
  submit: 'إرسال',
  playerTag: 'علامة اللاعب الخاصة بك',
  tagDescription: '* سيتم ملء معلومات المضيف من هذه العلامة.',
  tagPlaceholder: '#XXXXXXXXX',
  verify: 'تحقق',
  change: 'تغيير',
  searchHistory: 'سجل البحث',
  modeSelection: 'اختر الوضع',
  useCharacter: 'شخصيتك',
  midCharacters: 'شخصيات الوسط (الحد الأقصى 3)',
  sideCharacters: 'شخصيات الجانب (الحد الأقصى 3)',
  inviteLink: 'رابط الدعوة',
  inviteLinkPlaceholder: 'الصق رابط الدعوة هنا',
  comment: 'تعليق (اختياري)',
  commentPlaceholder: 'أدخل التفاصيل أو المتطلبات',
  errors: {
    postLimitTitle: 'حد النشر',
    postLimitPrefix: 'يرجى الانتظار ',
    postLimitSuffix: ' قبل النشر مرة أخرى',
    minutes: ' دقائق',
    seconds: ' ثوان',
    selectMode: 'يرجى اختيار الوضع',
    playerInfo: 'يرجى الحصول على معلومات اللاعب',
    selectCharacter: 'يرجى اختيار شخصية',
    invalidLink: 'يرجى إدخال رابط دعوة صالح',
    enterTag: 'يرجى إدخال علامة اللاعب',
    invalidTag: 'علامة اللاعب غير صالحة',
    fetchFailed: 'فشل في جلب بيانات اللاعب',
    maxMidChars: 'يمكنك اختيار حتى 3 شخصيات وسط',
    maxSideChars: 'يمكنك اختيار حتى 3 شخصيات جانبية',
    refreshCooldown: 'سيكون التحديث متاحًا خلال 3 ثوان',
    refreshFailed: 'فشل التحديث',
    postCreationFailed: 'فشل إنشاء المنشور'
  },
  success: {
    postCreated: 'تم إنشاء المنشور بنجاح'
  },
  modes: {
    ranked: 'معركة مصنفة',
    duoShowdown: 'مواجهة ثنائية',
    gemGrab: 'جمع الجواهر',
    brawlBall: 'كرة براول',
    heist: 'السطو',
    knockout: 'ضربة قاضية',
    bounty: 'المكافأة',
    wipeout: 'الإبادة',
    hotZone: 'المنطقة الساخنة',
    brawlBall5v5: 'كرة براول 5 ضد 5',
    wipeout5v5: 'إبادة 5 ضد 5'
  }
};

export const fr: TeamBoardTranslation = {
  boardTitle: 'Recrutement d\'équipe',
  refresh: 'Actualiser',
  create: 'Créer',
  cancel: 'Annuler',
  submit: 'Envoyer',
  playerTag: 'Votre Tag de Joueur',
  tagDescription: '* Les informations de l\'hôte seront remplies à partir de ce tag.',
  tagPlaceholder: '#XXXXXXXXX',
  verify: 'Vérifier',
  change: 'Modifier',
  searchHistory: 'Historique de recherche',
  modeSelection: 'Sélectionner le mode',
  useCharacter: 'Votre personnage',
  midCharacters: 'Personnages Mid (Max 3)',
  sideCharacters: 'Personnages Side (Max 3)',
  inviteLink: 'Lien d\'invitation',
  inviteLinkPlaceholder: 'Collez le lien d\'invitation ici',
  comment: 'Commentaire (Optionnel)',
  commentPlaceholder: 'Entrez les détails ou les exigences',
  errors: {
    postLimitTitle: 'Limite de publication',
    postLimitPrefix: 'Veuillez attendre ',
    postLimitSuffix: ' avant de publier à nouveau',
    minutes: ' minutes',
    seconds: ' secondes',
    selectMode: 'Veuillez sélectionner un mode',
    playerInfo: 'Veuillez obtenir les informations du joueur',
    selectCharacter: 'Veuillez sélectionner un personnage',
    invalidLink: 'Veuillez entrer un lien d\'invitation valide',
    enterTag: 'Veuillez entrer un tag de joueur',
    invalidTag: 'Tag de joueur invalide',
    fetchFailed: 'Échec de la récupération des données du joueur',
    maxMidChars: 'Vous pouvez sélectionner jusqu\'à 3 personnages mid',
    maxSideChars: 'Vous pouvez sélectionner jusqu\'à 3 personnages side',
    refreshCooldown: 'L\'actualisation sera disponible dans 3 secondes',
    refreshFailed: 'Échec de l\'actualisation',
    postCreationFailed: 'Échec de la création du post'
  },
  success: {
    postCreated: 'Post créé avec succès'
  },
  modes: {
    ranked: 'Combat classé',
    duoShowdown: 'Combat en duo',
    gemGrab: 'Capture de gemmes',
    brawlBall: 'Brawl Ball',
    heist: 'Braquage',
    knockout: 'K.O.',
    bounty: 'Prime',
    wipeout: 'Élimination',
    hotZone: 'Zone chaude',
    brawlBall5v5: 'Brawl Ball 5v5',
    wipeout5v5: 'Élimination 5v5'
  }
};

export const es: TeamBoardTranslation = {
  boardTitle: 'Reclutamiento de equipo',
  refresh: 'Actualizar',
  create: 'Crear',
  cancel: 'Cancelar',
  submit: 'Enviar',
  playerTag: 'Tu Tag de Jugador',
  tagDescription: '* La información del anfitrión se completará con este tag.',
  tagPlaceholder: '#XXXXXXXXX',
  verify: 'Verificar',
  change: 'Cambiar',
  searchHistory: 'Historial de búsqueda',
  modeSelection: 'Seleccionar modo',
  useCharacter: 'Tu personaje',
  midCharacters: 'Personajes Mid (Máx 3)',
  sideCharacters: 'Personajes Side (Máx 3)',
  inviteLink: 'Enlace de invitación',
  inviteLinkPlaceholder: 'Pega el enlace de invitación aquí',
  comment: 'Comentario (Opcional)',
  commentPlaceholder: 'Ingresa detalles o requisitos',
  errors: {
    postLimitTitle: 'Límite de publicación',
    postLimitPrefix: 'Por favor espera ',
    postLimitSuffix: ' antes de publicar de nuevo',
    minutes: ' minutos',
    seconds: ' segundos',
    selectMode: 'Por favor selecciona un modo',
    playerInfo: 'Por favor obtén la información del jugador',
    selectCharacter: 'Por favor selecciona un personaje',
    invalidLink: 'Por favor ingresa un enlace de invitación válido',
    enterTag: 'Por favor ingresa un tag de jugador',
    invalidTag: 'Tag de jugador inválido',
    fetchFailed: 'Error al obtener datos del jugador',
    maxMidChars: 'Puedes seleccionar hasta 3 personajes mid',
    maxSideChars: 'Puedes seleccionar hasta 3 personajes side',
    refreshCooldown: 'La actualización estará disponible en 3 segundos',
    refreshFailed: 'Error al actualizar',
    postCreationFailed: 'Error al crear la publicación'
  },
  success: {
    postCreated: 'Publicación creada exitosamente'
  },
  modes: {
    ranked: 'Batalla clasificatoria',
    duoShowdown: 'Supervivencia por parejas',
    gemGrab: 'Atrapagemas',
    brawlBall: 'Brawl Ball',
    heist: 'Atraco',
    knockout: 'Nocaut',
    bounty: 'Recompensa',
    wipeout: 'Eliminación',
    hotZone: 'Zona candente',
    brawlBall5v5: 'Brawl Ball 5v5',
    wipeout5v5: 'Eliminación 5v5'
  }
};

export const zhTw: TeamBoardTranslation = {
  boardTitle: '組隊招募',
  refresh: '重新整理',
  create: '發布招募',
  cancel: '取消',
  submit: '送出',
  playerTag: '你的玩家標籤',
  tagDescription: '* 將從此標籤填入主持人資訊。',
  tagPlaceholder: '#XXXXXXXXX',
  verify: '驗證',
  change: '變更',
  searchHistory: '搜尋紀錄',
  modeSelection: '選擇模式',
  useCharacter: '使用角色',
  midCharacters: '中路角色 (最多3個)',
  sideCharacters: '邊路角色 (最多3個)',
  inviteLink: '邀請連結',
  inviteLinkPlaceholder: '在此貼上邀請連結',
  comment: '備註 (選填)',
  commentPlaceholder: '輸入詳細資訊或要求',
  errors: {
    postLimitTitle: '發文限制',
    postLimitPrefix: '請等待',
    postLimitSuffix: '後再次發布',
    minutes: '分鐘',
    seconds: '秒',
    selectMode: '請選擇模式',
    playerInfo: '請取得玩家資訊',
    selectCharacter: '請選擇角色',
    invalidLink: '請輸入有效的邀請連結',
    enterTag: '請輸入玩家標籤',
    invalidTag: '無效的玩家標籤',
    fetchFailed: '取得玩家資料失敗',
    maxMidChars: '中路角色最多只能選擇3個',
    maxSideChars: '邊路角色最多只能選擇3個',
    refreshCooldown: '3秒後才能重新整理',
    refreshFailed: '重新整理失敗',
    postCreationFailed: '發布貼文失敗'
  },
  success: {
    postCreated: '貼文發布成功'
  },
  modes: {
    ranked: '排位賽',
    duoShowdown: '雙人生存',
    gemGrab: '寶石搶奪',
    brawlBall: '荒野足球',
    heist: '金庫保衛',
    knockout: '淘汰賽',
    bounty: '賞金賽',
    wipeout: '殲滅戰',
    hotZone: '熱區爭奪',
    brawlBall5v5: '5對5荒野足球',
    wipeout5v5: '5對5殲滅戰'
  }
};

// Update translations object
export const teamBoardTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw
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