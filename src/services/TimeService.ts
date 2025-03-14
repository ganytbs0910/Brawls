// TimeService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// サーバー時間と日時操作を一元管理するサービス
class TimeService {
  // キャッシュキーの接頭辞
  private static readonly CLAIM_PREFIX = 'claim_time_';
  
  // サーバー時間と端末時間のずれを保存するキー
  private static readonly TIME_OFFSET_KEY = 'server_time_offset';
  
  // サーバー時間のずれ（ミリ秒）
  private static timeOffset: number = 0;
  
  // 初期化済みフラグ
  private static initialized: boolean = false;
  
  // 時間同期に成功したかどうかのフラグ
  private static syncSuccessful: boolean = false;
  
  // ボーナス再取得可能までの時間（ミリ秒）- 20時間
  private static readonly BONUS_COOLDOWN_MS = 20 * 60 * 60 * 1000;
  
  /**
   * 初期化メソッド - 複数回の再試行を追加
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // 保存されたオフセットがあれば読み込む
      const savedOffset = await AsyncStorage.getItem(this.TIME_OFFSET_KEY);
      if (savedOffset) {
        this.timeOffset = parseInt(savedOffset, 10);
        this.syncSuccessful = true; // 保存値がある場合は同期成功とみなす
        console.log('Loaded saved time offset:', this.timeOffset);
      } else {
        // サーバーから時間を取得してオフセットを計算（最大3回試行）
        this.syncSuccessful = false;
        for (let attempt = 1; attempt <= 3 && !this.syncSuccessful; attempt++) {
          try {
            console.log(`Time sync attempt ${attempt}/3...`);
            await this.syncWithServerTime();
            this.syncSuccessful = true;
            console.log('Time sync successful.');
          } catch (syncError) {
            console.error(`Time sync attempt ${attempt} failed:`, syncError);
            // 最後の試行で失敗した場合のみオフセットを0に設定
            if (attempt === 3) {
              this.timeOffset = 0;
              console.log('Using device time as fallback after all sync attempts failed');
            }
            
            // 再試行前に少し待機
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('TimeService initialization error:', error);
      // 初期化エラーの場合はオフセットを0に設定（端末時間を信頼）
      this.timeOffset = 0;
      this.syncSuccessful = false;
    }
  }
  
  /**
   * 時間同期が成功したかを返す
   * @returns 同期成功ならtrue
   */
  static isSyncSuccessful(): boolean {
    return this.syncSuccessful;
  }
  
  /**
   * バックアップAPIを使用したサーバー時間同期
   * 主要APIが失敗した場合の代替手段
   */
  static async syncWithBackupAPI(): Promise<boolean> {
    try {
      // 別のAPIエンドポイントを試す
      // 例: TimeAPIのHTTPSエンドポイント
      const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Tokyo');
      const data = await response.json();
      
      // TimeAPIのレスポンスフォーマットは異なるので適切に処理
      const serverTime = new Date(data.dateTime).getTime();
      
      // 端末時間とサーバー時間のずれを計算（簡略化のため往復時間は考慮しない）
      this.timeOffset = serverTime - Date.now();
      
      console.log(`Backup time sync successful. Offset: ${this.timeOffset}ms`);
      
      // オフセットを保存
      await AsyncStorage.setItem(this.TIME_OFFSET_KEY, this.timeOffset.toString());
      
      this.syncSuccessful = true;
      return true;
    } catch (error) {
      console.error('Backup time sync error:', error);
      this.syncSuccessful = false;
      return false;
    }
  }
  
  /**
   * サーバー時間との同期を行う
   * 無料の日本時間APIからサーバー時間を取得して端末時間とのずれを計算
   */
  static async syncWithServerTime(): Promise<void> {
    try {
      // リクエスト送信前の端末時間を記録
      const beforeRequestTime = Date.now();
      
      // WorldTimeAPI（無料）を使用して日本時間を取得 - HTTPSを使用
      const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
      const data = await response.json();
      
      // リクエスト後の端末時間を記録
      const afterRequestTime = Date.now();
      
      // リクエストにかかった時間の半分を往復時間として考慮
      const roundTripTime = (afterRequestTime - beforeRequestTime) / 2;
      
      // サーバー時間（ミリ秒）
      // WorldTimeAPIのdatetimeはISO8601形式
      const serverTime = new Date(data.datetime).getTime();
      
      // 補正された現在時刻
      const correctedNow = beforeRequestTime + roundTripTime;
      
      // 端末時間とサーバー時間のずれを計算
      this.timeOffset = serverTime - correctedNow;
      
      console.log(`Server time sync successful. Offset: ${this.timeOffset}ms`);
      
      // オフセットを保存
      await AsyncStorage.setItem(this.TIME_OFFSET_KEY, this.timeOffset.toString());
      
      this.syncSuccessful = true;
    } catch (error) {
      console.error('Server time sync error:', error);
      
      // プライマリAPIが失敗した場合、バックアップAPIを試す
      const backupSuccess = await this.syncWithBackupAPI();
      
      if (!backupSuccess) {
        // すべてのAPIが失敗した場合はオフセットを0に設定
        this.timeOffset = 0;
        this.syncSuccessful = false;
        console.log('All time sync methods failed. Using local device time instead.');
        
        // 開発環境でのデバッグ情報
        if (__DEV__) {
          console.log('Note: This might not work in simulators without proper network setup');
          console.log('Suggestion: Check your internet connection or try on a real device');
        }
      }
    }
  }
  
  /**
   * 現在の日本時間を文字列形式で取得
   * @param format 出力形式（'full': 年月日時分秒, 'date': 年月日, 'time': 時分秒）
   * @returns フォーマットされた日本時間
   */
  static getFormattedJapanTime(format: 'full' | 'date' | 'time' = 'full'): string {
    const japanTime = new Date(this.getCurrentServerTime());
    
    // 日本語の曜日
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[japanTime.getDay()];
    
    const year = japanTime.getFullYear();
    const month = String(japanTime.getMonth() + 1).padStart(2, '0');
    const day = String(japanTime.getDate()).padStart(2, '0');
    const hours = String(japanTime.getHours()).padStart(2, '0');
    const minutes = String(japanTime.getMinutes()).padStart(2, '0');
    const seconds = String(japanTime.getSeconds()).padStart(2, '0');
    
    switch (format) {
      case 'date':
        return `${year}年${month}月${day}日(${weekday})`;
      case 'time':
        return `${hours}:${minutes}:${seconds}`;
      case 'full':
      default:
        return `${year}年${month}月${day}日(${weekday}) ${hours}:${minutes}:${seconds}`;
    }
  }
  
  /**
   * 現在のサーバー時間を取得
   * @returns サーバー時間（ミリ秒）
   */
  static getCurrentServerTime(): number {
    return Date.now() + this.timeOffset;
  }
  
  /**
   * 現在の日付を取得（サーバー時間基準）
   * @returns YYYY-MM-DD形式の日付文字列
   */
  static getCurrentDateString(): string {
    const date = new Date(this.getCurrentServerTime());
    return this.formatDate(date);
  }
  
  /**
   * 日付をYYYY-MM-DD形式にフォーマット
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * デイリーボーナスが受け取り可能かチェック
   * @param userId ユーザーID
   * @param bonusType ボーナスタイプ（'login'または'freeClaim'）
   * @returns 受け取り可能ならtrue
   */
  static async canClaimDailyBonus(userId: string, bonusType: string): Promise<boolean> {
    try {
      // 初期化確認
      if (!this.initialized) {
        await this.initialize();
      }
      
      // 時間同期に失敗している場合はボーナス獲得不可
      if (!this.syncSuccessful) {
        console.log(`Bonus claim blocked: time sync unsuccessful for ${bonusType}`);
        return false;
      }
      
      // 最後に受け取った時間のキー
      const timeKey = `${this.CLAIM_PREFIX}${bonusType}_${userId}`;
      
      // 保存された最終受け取り時間を取得
      const lastClaimTime = await AsyncStorage.getItem(timeKey);
      
      if (!lastClaimTime) {
        // 一度も受け取っていない場合は受け取り可能
        return true;
      }
      
      // 最終受け取り時間をミリ秒で取得
      const lastClaimMs = parseInt(lastClaimTime, 10);
      
      // 現在のサーバー時間（ミリ秒）
      const currentTimeMs = this.getCurrentServerTime();
      
      // 前回の受け取りから20時間経過したかチェック
      const timeSinceLastClaim = currentTimeMs - lastClaimMs;
      const canClaim = timeSinceLastClaim >= this.BONUS_COOLDOWN_MS;
      
      console.log(`Bonus check for ${bonusType}: Time since last claim: ${(timeSinceLastClaim / (60 * 60 * 1000)).toFixed(2)} hours, Can claim: ${canClaim}`);
      
      return canClaim;
    } catch (error) {
      console.error(`Bonus check error (${bonusType}):`, error);
      return false;
    }
  }
  
  /**
   * ボーナス受け取りを記録
   * @param userId ユーザーID
   * @param bonusType ボーナスタイプ
   * @returns 記録が成功したらtrue
   */
  static async recordBonusClaim(userId: string, bonusType: string): Promise<boolean> {
    try {
      // 初期化確認
      if (!this.initialized) {
        await this.initialize();
      }
      
      // 時間同期に失敗している場合は記録不可
      if (!this.syncSuccessful) {
        console.log(`Bonus record blocked: time sync unsuccessful for ${bonusType}`);
        return false;
      }
      
      // 受け取り時間のキー
      const timeKey = `${this.CLAIM_PREFIX}${bonusType}_${userId}`;
      
      // 現在のサーバー時間を記録
      const currentServerTime = this.getCurrentServerTime();
      await AsyncStorage.setItem(timeKey, currentServerTime.toString());
      
      return true;
    } catch (error) {
      console.error(`Record bonus error (${bonusType}):`, error);
      return false;
    }
  }

  /**
   * 次回ボーナス受け取り可能時間を取得
   * @param userId ユーザーID 
   * @param bonusType ボーナスタイプ
   * @returns 次回受け取り可能時間（ミリ秒）またはnull（受け取り可能な場合）
   */
  static async getNextBonusAvailableTime(userId: string, bonusType: string): Promise<number | null> {
    try {
      // 初期化確認
      if (!this.initialized) {
        await this.initialize();
      }
      
      // 時間同期に失敗している場合はnullを返す
      if (!this.syncSuccessful) {
        return null;
      }
      
      // 最後に受け取った時間のキー
      const timeKey = `${this.CLAIM_PREFIX}${bonusType}_${userId}`;
      
      // 保存された最終受け取り時間を取得
      const lastClaimTime = await AsyncStorage.getItem(timeKey);
      
      if (!lastClaimTime) {
        // 一度も受け取っていない場合は即座に受け取り可能
        return null;
      }
      
      // 最終受け取り時間をミリ秒で取得
      const lastClaimMs = parseInt(lastClaimTime, 10);
      
      // 次回受け取り可能時間を計算
      const nextAvailableTime = lastClaimMs + this.BONUS_COOLDOWN_MS;
      
      // 現在のサーバー時間（ミリ秒）
      const currentTimeMs = this.getCurrentServerTime();
      
      // 既に受け取り可能な場合はnullを返す
      if (currentTimeMs >= nextAvailableTime) {
        return null;
      }
      
      // まだ受け取り不可能な場合は次回可能時間を返す
      return nextAvailableTime;
    } catch (error) {
      console.error(`Next bonus time check error (${bonusType}):`, error);
      return null;
    }
  }

  /**
   * 次回ボーナス受け取りまでの残り時間を取得（フォーマット済み）
   * @param userId ユーザーID
   * @param bonusType ボーナスタイプ
   * @returns フォーマットされた残り時間または空文字列（エラーまたは即受け取り可能な場合）
   */
  static async getFormattedTimeToNextBonus(userId: string, bonusType: string): Promise<string> {
    try {
      const nextTime = await this.getNextBonusAvailableTime(userId, bonusType);
      
      if (nextTime === null) {
        return ''; // 即受け取り可能
      }
      
      // 現在のサーバー時間（ミリ秒）
      const currentTimeMs = this.getCurrentServerTime();
      
      // 残り時間（ミリ秒）
      const remainingMs = nextTime - currentTimeMs;
      
      if (remainingMs <= 0) {
        return ''; // 受け取り可能
      }
      
      // 時間、分、秒に変換
      const hours = Math.floor(remainingMs / (60 * 60 * 1000));
      const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
      
      // フォーマット
      return `${hours}時間${minutes}分${seconds}秒後`;
    } catch (error) {
      console.error(`Formatted time check error (${bonusType}):`, error);
      return '';
    }
  }
}

export default TimeService;