import AsyncStorage from '@react-native-async-storage/async-storage';

// ストレージキー
const DAILY_BONUSES_KEY = 'time_daily_bonuses';

// インターフェース定義
interface BonusRecord {
  claimedAt: string;
  serverTimestamp: number;
  deviceTime: number;
}

interface UserBonusRecords {
  [bonusType: string]: {
    [date: string]: BonusRecord;
  };
}

interface AllBonusRecords {
  [userId: string]: UserBonusRecords;
}

class ServerTimeDetector {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * タイム検出器の初期化
   */
  private async initialize(): Promise<void> {
    try {
      this.isInitialized = true;
    } catch (error) {
      console.error('タイム検出器の初期化エラー:', error);
    }
  }

  /**
   * 世界時間APIを使用してサーバー時間を取得
   */
  private async getServerTime(): Promise<number | null> {
    try {
      const response = await fetch('https://worldtimeapi.org/api/ip');
      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }
      const data = await response.json();
      const serverTime = new Date(data.datetime).getTime();
      console.log(`サーバー時間取得成功: ${new Date(serverTime).toISOString()}`);
      return serverTime;
    } catch (error) {
      console.error('サーバー時間取得エラー:', error);
      
      // バックアップとして別のAPIを試す
      try {
        const backupResponse = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
        if (backupResponse.ok) {
          const backupData = await backupResponse.json();
          const serverTime = new Date(backupData.dateTime).getTime();
          console.log(`バックアップサーバー時間取得成功: ${new Date(serverTime).toISOString()}`);
          return serverTime;
        }
      } catch (backupError) {
        console.error('バックアップサーバー時間取得エラー:', backupError);
      }
      
      // どちらのAPIも失敗した場合
      return null;
    }
  }

  /**
   * ユーザーの最近のボーナス受け取り履歴を取得
   */
  private async getUserRecentBonusHistory(userId: string, bonusType: string): Promise<BonusRecord[]> {
    try {
      const bonusesStr = await AsyncStorage.getItem(DAILY_BONUSES_KEY);
      const bonuses: AllBonusRecords = bonusesStr ? JSON.parse(bonusesStr) : {};
      
      if (!bonuses[userId] || !bonuses[userId][bonusType]) {
        return [];
      }
      
      const bonusRecords = bonuses[userId][bonusType];
      return Object.values(bonusRecords).sort((a, b) => a.serverTimestamp - b.serverTimestamp);
    } catch (error) {
      console.error('ボーナス履歴取得エラー:', error);
      return [];
    }
  }

  /**
   * 日付をYYYY-MM-DD形式で取得（サーバー時間使用）
   */
  private getServerDateString(serverTime: number): string {
    const date = new Date(serverTime);
    return date.toISOString().split('T')[0];
  }

  /**
   * ユーザーがデイリーボーナスを受け取れるかをチェック（完全にサーバー時間に依存）
   */
  public async canClaimDailyBonus(userId: string, bonusType: string): Promise<boolean> {
    try {
      // 初期化が完了していることを確認
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // サーバー時間を取得（必須）
      const serverTime = await this.getServerTime();
      if (!serverTime) {
        console.log('サーバー時間を取得できないため、ボーナス受け取りは不可');
        return false;
      }
      
      // サーバー時間から今日の日付を取得
      const serverDate = this.getServerDateString(serverTime);
      console.log(`サーバー時間による今日の日付: ${serverDate}`);
      
      const bonusesStr = await AsyncStorage.getItem(DAILY_BONUSES_KEY);
      const bonuses: AllBonusRecords = bonusesStr ? JSON.parse(bonusesStr) : {};
      
      // ユーザーレコードが存在しない場合は初期化
      if (!bonuses[userId]) {
        console.log('ユーザーの初回ボーナス受け取り');
        return true;
      }
      
      // ボーナスタイプレコードが存在しない場合は初期化
      if (!bonuses[userId][bonusType]) {
        console.log('このボーナスタイプの初回受け取り');
        return true;
      }
      
      // 今日のボーナスがすでに受け取られているかをチェック（サーバー日付使用）
      if (bonuses[userId][bonusType][serverDate]) {
        console.log(`今日(${serverDate})のボーナスは既に受け取り済みです`);
        return false;
      }
      
      // 最近の受け取り履歴を取得
      const recentClaims = await this.getUserRecentBonusHistory(userId, bonusType);
      
      if (recentClaims.length > 0) {
        const lastClaim = recentClaims[recentClaims.length - 1];
        
        // 最後のボーナス受け取りから20時間以上経過しているか確認（サーバー時間使用）
        const hoursSinceLastClaim = (serverTime - lastClaim.serverTimestamp) / (60 * 60 * 1000);
        if (hoursSinceLastClaim < 20) {
          console.log(`前回の受け取りから ${hoursSinceLastClaim.toFixed(2)} 時間しか経過していません。最低20時間必要です`);
          return false;
        }
        
        // 過去24時間以内に複数回受け取り履歴がある場合は不審（サーバー時間使用）
        const claimsLast24Hours = recentClaims.filter(claim => 
          serverTime - claim.serverTimestamp < 24 * 60 * 60 * 1000
        );
        
        if (claimsLast24Hours.length > 1) {
          console.log('過去24時間以内に複数回のボーナス受け取りがあります。不審な活動です');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('デイリーボーナスチェックエラー:', error);
      // エラー時は不正防止のためfalseを返す
      return false;
    }
  }
  
  /**
   * ボーナス受け取りを記録（サーバー時間使用）
   */
  public async recordBonusClaim(userId: string, bonusType: string): Promise<boolean> {
    try {
      // サーバー時間を取得（必須）
      const serverTime = await this.getServerTime();
      if (!serverTime) {
        console.log('サーバー時間を取得できないため、ボーナス受け取りを記録できません');
        return false;
      }
      
      const serverDate = this.getServerDateString(serverTime);
      const deviceNow = Date.now();
      
      const bonusesStr = await AsyncStorage.getItem(DAILY_BONUSES_KEY);
      const bonuses: AllBonusRecords = bonusesStr ? JSON.parse(bonusesStr) : {};
      
      // レコードが存在しない場合は初期化
      if (!bonuses[userId]) {
        bonuses[userId] = {};
      }
      
      if (!bonuses[userId][bonusType]) {
        bonuses[userId][bonusType] = {};
      }
      
      // ボーナス受け取りを記録（サーバー時間使用）
      bonuses[userId][bonusType][serverDate] = {
        claimedAt: new Date(serverTime).toISOString(),
        serverTimestamp: serverTime,
        deviceTime: deviceNow
      };
      
      // すべての受け取り履歴を保存
      await AsyncStorage.setItem(DAILY_BONUSES_KEY, JSON.stringify(bonuses));
      
      // 追加検証のために別の記録も保存
      const timeKey = `last_${bonusType}_${userId}`;
      await AsyncStorage.setItem(timeKey, JSON.stringify({
        serverTime: serverTime,
        deviceTime: deviceNow,
        date: serverDate
      }));
      
      return true;
    } catch (error) {
      console.error('ボーナス受け取り記録エラー:', error);
      return false;
    }
  }

  /**
   * デバッグ用：すべての時間関連データをクリア
   */
  public async resetAllTimeData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DAILY_BONUSES_KEY);
    } catch (error) {
      console.error('時間データリセットエラー:', error);
    }
  }
  
  /**
   * 現在のサーバー時間情報を文字列で取得（デバッグ用）
   */
  public async getDebugTimeInfo(): Promise<string> {
    const deviceTime = Date.now();
    const serverTime = await this.getServerTime();
    
    return `
デバイス時間: ${new Date(deviceTime).toISOString()}
サーバー時間: ${serverTime ? new Date(serverTime).toISOString() : '取得できませんでした'}
`;
  }
}

// シングルトンインスタンスをエクスポート
export default new ServerTimeDetector();