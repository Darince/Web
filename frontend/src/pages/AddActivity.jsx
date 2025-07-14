import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddActivity({ user }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (user !== 'admin') {
      alert('只有管理员可以添加活动');
      return;
    }

    if (!title || !time || !location || !description) {
      alert('请填写所有字段');
      return;
    }

    try {
      const res = await axios.post('/api/activities', {
        username: user,
        title,
        time,
        location,
        description
      });

      if (res.data.success) {
        alert('活动添加成功！');
        // 可选择跳转或清空表单
        navigate('/activities');
      } else {
        alert(res.data.message || '添加失败');
      }
    } catch (err) {
      console.error('添加失败', err);
      alert('请求失败');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">添加新活动</h2>

      <input
        type="text"
        placeholder="活动标题"
        className="w-full border p-2 mb-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="活动时间"
        className="w-full border p-2 mb-3 rounded"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <input
        type="text"
        placeholder="活动地点"
        className="w-full border p-2 mb-3 rounded"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <textarea
        placeholder="活动描述"
        className="w-full border p-2 mb-4 rounded h-28"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        添加活动
      </button>
    </div>
  );
}
