// SimpleTimeDetector.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存用のキー
const LAST_CHECK_TIME_KEY = 'time_last_check';
const DAILY_BONUSES_KEY = 'time_daily_bonuses';

// ボーナス記録の型定義
interface BonusRecord {
  claimedAt: string;
}

interface BonusTypeRecords {
  [date: string]: BonusRecord;
}

interface UserBonusRecords {
  [bonusType: string]: BonusTypeRecords;
}

interface AllBonusRecords {
  [userId: string]: UserBonusRecords;
}

class SimpleTimeDetector {
  // 前回のチェック時間と現在時間を比較して不正を検出
  public async detectTimeManipulation(): Promise<boolean> {
    try {
      const now = new Date();
      const storedTimeStr = await AsyncStorage.getItem(LAST_CHECK_TIME_KEY);
      
      // 前回の記録がなければ初回実行とみなす
      if (!storedTimeStr) {
        await this.storeCurrentTime();
        return false;
      }
      
      const storedTime = new Date(storedTimeStr);
      const diffMs = now.getTime() - storedTime.getTime();
      
      // 現在時刻が前回記録より前になっている場合（時間が巻き戻っている）
      if (diffMs < 0) {
        console.warn('Time manipulation detected: Clock moved backwards');
        return true;
      }
      
      // 前回の保存から24時間以上経っているが、日付が1日しか変わっていない場合も不正の可能性
      const dayDiff = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      const actualDayDiff = this.getDayDifference(storedTime, now);
      
      if (dayDiff > 1 && actualDayDiff <= 1) {
        console.warn('Time manipulation detected: Date inconsistency');
        return true;
      }
      
      // 問題なければ現在時刻を保存して正常と判断
      await this.storeCurrentTime();
      return false;
    } catch (error) {
      console.error('Error in time manipulation detection:', error);
      return false; // エラー時は正常と判断（ユーザー体験優先）
    }
  }
  
  // 現在時刻を保存
  private async storeCurrentTime(): Promise<void> {
    const now = new Date();
    await AsyncStorage.setItem(LAST_CHECK_TIME_KEY, now.toISOString());
  }
  
  // 2つの日付の日数差を計算
  private getDayDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.round(Math.abs((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000)));
  }
  
  // 指定したIDのボーナスが今日受け取れるかをチェック
  public async canClaimDailyBonus(userId: string, bonusType: string): Promise<boolean> {
    try {
      // 不正検出
      const isManipulated = await this.detectTimeManipulation();
      if (isManipulated) {
        return false;
      }
      
      const today = new Date().toISOString().split('T')[0];
      const bonusesStr = await AsyncStorage.getItem(DAILY_BONUSES_KEY);
      const bonuses: AllBonusRecords = bonusesStr ? JSON.parse(bonusesStr) : {};
      
      // ユーザー別の記録がなければ初期化
      if (!bonuses[userId]) {
        bonuses[userId] = {};
      }
      
      // ボーナスタイプ別の記録がなければ初期化
      if (!bonuses[userId][bonusType]) {
        bonuses[userId][bonusType] = {};
      }
      
      // 今日の記録がなければ受け取り可能
      return !bonuses[userId][bonusType][today];
    } catch (error) {
      console.error('Error checking daily bonus:', error);
      return false;
    }
  }
  
  // ボーナス受け取りを記録
  public async recordBonusClaim(userId: string, bonusType: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bonusesStr = await AsyncStorage.getItem(DAILY_BONUSES_KEY);
      const bonuses: AllBonusRecords = bonusesStr ? JSON.parse(bonusesStr) : {};
      
      // ユーザー別の記録がなければ初期化
      if (!bonuses[userId]) {
        bonuses[userId] = {};
      }
      
      // ボーナスタイプ別の記録がなければ初期化
      if (!bonuses[userId][bonusType]) {
        bonuses[userId][bonusType] = {};
      }
      
      // 今日の受け取りを記録
      bonuses[userId][bonusType][today] = {
        claimedAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(DAILY_BONUSES_KEY, JSON.stringify(bonuses));
      return true;
    } catch (error) {
      console.error('Error recording bonus claim:', error);
      return false;
    }
  }
}

// シングルトンインスタンスをエクスポート
export default new SimpleTimeDetector();