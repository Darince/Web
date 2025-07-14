import { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityCard from '../components/ActivityCard';

export default function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('/api/activities')
      .then(res => {
        if (res.data.success) {
          setActivities(res.data.data);
        } else {
          console.error('加载失败');
        }
      })
      .catch(err => {
        console.error('请求错误', err);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">活动列表</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
