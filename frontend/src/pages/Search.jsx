import { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityCard from '../components/ActivityCard';

export default function Search({ user, joinedActivities }) {
  const [activities, setActivities] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState([]);

  // ✅ 加载活动数据
  useEffect(() => {
    axios.get('/api/activities')
      .then(res => {
        if (res.data.success) {
          setActivities(res.data.data);
          setFiltered(res.data.data);
        }
      })
      .catch(err => {
        console.error('加载活动失败', err);
      });
  }, []);

  const handleSearch = () => {
    const kw = keyword.trim().toLowerCase();
    const result = activities.filter(a =>
      a.title.toLowerCase().includes(kw) ||
      a.description.toLowerCase().includes(kw)
    );
    setFiltered(result);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">搜索活动</h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="输入关键词..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSearch}
        >
          搜索
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            user={user}
            isJoined={joinedActivities.includes(activity.id)}
          />
        ))}
      </div>
    </div>
  );
}
