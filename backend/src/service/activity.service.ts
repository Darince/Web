import { Provide } from '@midwayjs/core';
import { Activity } from '../model/activity.model';

@Provide()
export class ActivityService {
  private activities: Activity[] = [
    { id: 1, title: '篮球比赛', time: '2025-07-20', location: '体育馆 A', description: '全校篮球友谊赛，欢迎报名！' },
    { id: 2, title: '羽毛球友谊赛', time: '2025-07-22', location: '羽毛球馆', description: '业余羽毛球选手交流赛' },
    { id: 3, title: '乒乓球单打赛', time: '2025-07-25', location: '室内乒乓球馆', description: '快来挑战最强乒乓王！' },
  ];

  async getAll(): Promise<Activity[]> {
    return this.activities;
  }
}
