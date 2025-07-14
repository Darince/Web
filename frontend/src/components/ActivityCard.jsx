import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ActivityCard({ activity, user, isJoined }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('确认删除该活动？')) return;

    try {
      const res = await axios.delete(`/api/activities/${activity.id}`, {
        data: { username: user }
      });

      if (res.data.success) {
        alert('删除成功');
        navigate('/activities');
        //setShouldReload(true);  // 简化：刷新页面
      } else {
        alert(res.data.message || '删除失败');
      }
    } catch (err) {
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold">{activity.title}</h3>
      <p className="text-sm text-gray-500">{activity.time} @ {activity.location}</p>
      <p className="mt-2">{activity.description}</p>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/activities/${activity.id}`}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          查看详细
        </Link>

        {isJoined && (
          <span className="text-green-600 text-sm px-2 py-1 border border-green-600 rounded">
            已报名
          </span>
        )}

        {user === 'admin' && (
          <button
            onClick={handleDelete}
            className="ml-auto text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            删除
          </button>
        )}
      </div>
    </div>
  );
}
