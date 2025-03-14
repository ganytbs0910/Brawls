import AsyncStorage from '@react-native-async-storage/async-storage';

// サーバー時間と日時操作を一元管理するサービス
class TimeService {
  // キャッシュキーの接頭辞
  private static readonly CLAIM_PREFIX = 'claim_time_';
  
  // サーバー時間と端末時間のずれを保存するキー
  private static readonly TIME_OFFSET_KEY = 'server_time_offset';
  
  // 最後の同期時間を記録するキー
  private static readonly LAST_SYNC_TIME_KEY = 'last_sync_time';
  
  // 端末時間操作検出用の基準タイムスタンプ（ミリ秒）
  private static readonly DEVICE_TIME_CHECK_KEY = 'device_time_reference';
  
  // 最大許容時間差（ミリ秒） - 10分
  private static readonly MAX_TIME_DRIFT_MS = 10 * 60 * 1000;
  
  // サーバー時間のずれ（ミリ秒）
  private static timeOffset: number = 0;
  
  // 同期時の端末時間基準点（不正検出用）
  private static deviceTimeReference: number = 0;
  
  // 最後の同期時間
  private static lastSyncTime: number = 0;
  
  // 初期化済みフラグ
  private static initialized: boolean = false;
  
  // 時間同期に成功したかどうかのフラグ
  private static syncSuccessful: boolean = false;
  
  // 端末時間が操作されたと判断されたフラグ
  private static timeManipulationDetected: boolean = false;
  
  // ボーナス再取得可能までの時間（ミリ秒）- 20時間
  private static readonly BONUS_COOLDOWN_MS = 20 * 60 * 60 * 1000;
  
  /**
   * 初期化メソッド - 複数回の再試行を追加
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // 保存されたデータを読み込む
      const [savedOffset, savedReference, savedLastSync] = await Promise.all([
        AsyncStorage.getItem(this.TIME_OFFSET_KEY),
        AsyncStorage.getItem(this.DEVICE_TIME_CHECK_KEY),
        AsyncStorage.getItem(this.LAST_SYNC_TIME_KEY)
      ]);
      
      const currentDeviceTime = Date.now();
      
      if (savedOffset && savedReference && savedLastSync) {
        // 保存値があれば読み込む
        this.timeOffset = parseInt(savedOffset, 10);
        this.deviceTimeReference = parseInt(savedReference, 10);
        this.lastSyncTime = parseInt(savedLastSync, 10);
        
        // 端末時間操作検出
        const elapsedRealTime = currentDeviceTime - this.deviceTimeReference;
        const expectedElapsedTime = Date.now() - this.lastSyncTime;
        
        // 経過時間の差が許容範囲を超えているか確認
        const timeDrift = Math.abs(elapsedRealTime - expectedElapsedTime);
        
        if (timeDrift > this.MAX_TIME_DRIFT_MS) {
          // 端末時間操作を検出
          console.warn('Time manipulation detected! Drift:', timeDrift);
          this.timeManipulationDetected = true;
          
          // サーバー時間を再同期
          await this.syncWithServerTime();
        } else {
          this.syncSuccessful = true;
          console.log('Loaded saved time offset:', this.timeOffset);
        }
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
   * 端末時間操作が検出されたかを返す
   * @returns 操作が検出されたらtrue
   */
  static isTimeManipulationDetected(): boolean {
    return this.timeManipulationDetected;
  }
  
  /**
   * バックアップAPIを使用したサーバー時間同期
   * 主要APIが失敗した場合の代替手段
   */
  static async syncWithBackupAPI(): Promise<boolean> {
    try {
      // リクエスト送信前の端末時間を記録
      const beforeRequestTime = Date.now();
      
      // 別のAPIエンドポイントを試す
      // 例: TimeAPIのHTTPSエンドポイント
      const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Tokyo');
      const data = await response.json();
      
      // リクエスト後の端末時間を記録
      const afterRequestTime = Date.now();
      
      // リクエストにかかった時間の半分を往復時間として考慮
      const roundTripTime = (afterRequestTime - beforeRequestTime) / 2;
      
      // サーバー時間（ミリ秒）
      const serverTime = new Date(data.dateTime).getTime();
      
      // 補正された現在時刻
      const correctedNow = beforeRequestTime + roundTripTime;
      
      // 端末時間とサーバー時間のずれを計算
      this.timeOffset = serverTime - correctedNow;
      
      // 同期情報を保存
      await this.saveTimeReferenceData(correctedNow);
      
      console.log(`Backup time sync successful. Offset: ${this.timeOffset}ms`);
      
      this.syncSuccessful = true;
      // 成功したらフラグをリセット
      this.timeManipulationDetected = false;
      return true;
    } catch (error) {
      console.error('Backup time sync error:', error);
      this.syncSuccessful = false;
      return false;
    }
  }
  
  /**
   * 時間参照データを保存
   * @param syncTime 同期時の時間
   */
  private static async saveTimeReferenceData(syncTime: number): Promise<void> {
    const currentDeviceTime = Date.now();
    this.deviceTimeReference = currentDeviceTime;
    this.lastSyncTime = syncTime;
    
    await Promise.all([
      AsyncStorage.setItem(this.TIME_OFFSET_KEY, this.timeOffset.toString()),
      AsyncStorage.setItem(this.DEVICE_TIME_CHECK_KEY, currentDeviceTime.toString()),
      AsyncStorage.setItem(this.LAST_SYNC_TIME_KEY, syncTime.toString())
    ]);
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
      
      // 同期情報を保存
      await this.saveTimeReferenceData(correctedNow);
      
      console.log(`Server time sync successful. Offset: ${this.timeOffset}ms`);
      
      this.syncSuccessful = true;
      // 成功したらフラグをリセット
      this.timeManipulationDetected = false;
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
   * 現在のサーバー時間を取得 - 不正操作検出機能付き
   * @param forceCheck 強制的に時間操作チェックを行うか
   * @returns サーバー時間（ミリ秒）
   */
  static getCurrentServerTime(forceCheck: boolean = false): number {
    // 不正操作検出
    if (forceCheck && this.deviceTimeReference > 0) {
      const currentDeviceTime = Date.now();
      const elapsedDeviceTime = currentDeviceTime - this.deviceTimeReference;
      const elapsedRealTime = currentDeviceTime - this.lastSyncTime;
      
      // 許容範囲を超える時間差を検出
      if (Math.abs(elapsedDeviceTime - elapsedRealTime) > this.MAX_TIME_DRIFT_MS) {
        console.warn('Time manipulation detected in getCurrentServerTime!');
        this.timeManipulationDetected = true;
        
        // 非同期で時間を再同期（結果を待たない）
        this.syncWithServerTime().catch(e => 
          console.error('Background time resync failed:', e)
        );
      }
    }
    
    // 端末時間に基づく計算ではなく、最後の同期時間からの経過時間と
    // その時のオフセットを考慮して計算
    if (this.lastSyncTime > 0) {
      const elapsed = Date.now() - this.deviceTimeReference;
      return this.lastSyncTime + elapsed + this.timeOffset;
    } else {
      // 同期データがない場合は従来の方法
      return Date.now() + this.timeOffset;
    }
  }
  
  /**
   * 現在の日本時間を文字列形式で取得
   * @param format 出力形式（'full': 年月日時分秒, 'date': 年月日, 'time': 時分秒）
   * @returns フォーマットされた日本時間
   */
  static getFormattedJapanTime(format: 'full' | 'date' | 'time' = 'full'): string {
    // 時間不正操作検出付き
    const japanTime = new Date(this.getCurrentServerTime(true));
    
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
   * 現在の日付を取得（サーバー時間基準）
   * @returns YYYY-MM-DD形式の日付文字列
   */
  static getCurrentDateString(): string {
    const date = new Date(this.getCurrentServerTime(true));
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
      
      // 端末時間操作が検出された場合はボーナス獲得不可
      if (this.timeManipulationDetected) {
        console.log(`Bonus claim blocked: time manipulation detected for ${bonusType}`);
        return false;
      }
      
      // 最後に受け取った時間のキー
      const timeKey = `${this.CLAIM_PREFIX}${bonusType}_${userId}`;
      
      // 保存された最終受け取り時間を取得
      const lastClaimTimeStr = await AsyncStorage.getItem(timeKey);
      
      if (!lastClaimTimeStr) {
        // 一度も受け取っていない場合は受け取り可能
        return true;
      }
      
      // 最終受け取り時間をミリ秒で取得
      const lastClaimTime = parseInt(lastClaimTimeStr, 10);
      
      // サーバーから時間を再取得して確実な検証を行う
      try {
        await this.syncWithServerTime();
      } catch (syncError) {
        console.error(`Time resync failed during bonus check (${bonusType}):`, syncError);
        // 同期失敗時はボーナス受け取り不可
        return false;
      }
      
      // 最新のサーバー時間
      const currentServerTime = this.getCurrentServerTime(true);
      
      // 前回の受け取りから20時間経過したかチェック
      const timeSinceLastClaim = currentServerTime - lastClaimTime;
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
      
      // 端末時間操作が検出された場合は記録不可
      if (this.timeManipulationDetected) {
        console.log(`Bonus record blocked: time manipulation detected for ${bonusType}`);
        return false;
      }
      
      // 受け取り時間のキー
      const timeKey = `${this.CLAIM_PREFIX}${bonusType}_${userId}`;
      
      // サーバーから時間を再取得（不正防止のため）
      try {
        await this.syncWithServerTime();
      } catch (syncError) {
        console.error(`Time resync failed during bonus record (${bonusType}):`, syncError);
        return false;
      }
      
      // 現在のサーバー時間を記録
      const currentServerTime = this.getCurrentServerTime(true);
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
      
      // 端末時間操作が検出された場合は情報を提供しない
      if (this.timeManipulationDetected) {
        console.log(`Next bonus time check blocked: time manipulation detected for ${bonusType}`);
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
      
      // 現在のサーバー時間（ミリ秒）- 不正検出あり
      const currentTimeMs = this.getCurrentServerTime(true);
      
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
      // 端末時間操作が検出された場合は特別なメッセージを返す
      if (this.timeManipulationDetected) {
        return '時間設定の異常が検出されました';
      }
      
      const nextTime = await this.getNextBonusAvailableTime(userId, bonusType);
      
      if (nextTime === null) {
        return ''; // 即受け取り可能
      }
      
      // 現在のサーバー時間（ミリ秒）
      const currentTimeMs = this.getCurrentServerTime(true);
      
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
  
  /**
   * 定期的な時間同期
   * 定期的に実行して不正操作を検出・防止
   * @param forceSyncWithServer 強制的にサーバーと同期するか
   */
  static async periodicTimeCheck(forceSyncWithServer: boolean = false): Promise<void> {
    try {
      if (!this.initialized) {
        await this.initialize();
        return;
      }
      
      if (this.deviceTimeReference === 0 || forceSyncWithServer) {
        // 同期データがない場合や強制同期時はサーバーから取得
        await this.syncWithServerTime();
        return;
      }
      
      // 端末時間操作検出
      const currentDeviceTime = Date.now();
      const elapsedRealTime = currentDeviceTime - this.deviceTimeReference;
      const expectedElapsedTime = currentDeviceTime - this.lastSyncTime;
      
      // 経過時間の差が許容範囲を超えているか確認
      const timeDrift = Math.abs(elapsedRealTime - expectedElapsedTime);
      
      if (timeDrift > this.MAX_TIME_DRIFT_MS) {
        // 端末時間操作を検出
        console.warn('Periodic check detected time manipulation! Drift:', timeDrift);
        this.timeManipulationDetected = true;
        
        // サーバー時間を再同期
        await this.syncWithServerTime();
      }
    } catch (error) {
      console.error('Periodic time check error:', error);
    }
  }
}

export default TimeService;