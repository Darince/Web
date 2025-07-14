import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityDetail({
  user,
  joinedActivities,
  setJoinedActivities,
}) {
  const { id } = useParams();
  const activityId = Number(id);

  const [activity, setActivity] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const isJoined = joinedActivities.includes(activityId);

  // ✅ 获取活动详情 & 评论列表
  useEffect(() => {
    axios.get("/api/activities").then((res) => {
      const act = res.data.data.find((a) => a.id === activityId);
      setActivity(act);
    });

    axios.get(`/api/activities/${activityId}/comments`).then((res) => {
      if (res.data.success) {
        setComments(res.data.data);
      }
    });
  }, [activityId]);

  const handleJoin = async () => {
    if (!user) return alert("请先登录再报名");
    if (isJoined) return alert("你已经报名过该活动了");

    try {
      const res = await axios.post(`/api/activities/${activityId}/join`, {
        username: user,
      });

      if (res.data.success) {
        setJoinedActivities((prev) => [...prev, activityId]);
        alert("报名成功！");
      } else {
        alert(res.data.message || "报名失败");
      }
    } catch (err) {
      console.error(err);
      alert("请求失败，请稍后重试");
    }
  };

  // ✅ 提交评论
  const handleSubmitComment = async () => {
    if (!user) return alert("请先登录才能评论");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/api/activities/${activityId}/comments`, {
        username: user,
        content: commentText.trim(),
      });

      if (res.data.success) {
        setCommentText("");
        // 重新加载评论
        const reload = await axios.get(
          `/api/activities/${activityId}/comments`
        );
        if (reload.data.success) {
          setComments(reload.data.data);
        }
      } else {
        alert(res.data.message || "评论失败");
      }
    } catch (err) {
      console.error(err);
      alert("请求失败");
    }
  };

  if (!activity) return <div className="p-4">加载中...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{activity.title}</h2>
      <p className="text-gray-600 mb-2">
        {activity.time} @ {activity.location}
      </p>
      <p className="mb-4">{activity.description}</p>

      <button
        onClick={handleJoin}
        className={`px-4 py-2 rounded ${
          isJoined ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
        }`}
        disabled={isJoined}
      >
        {isJoined ? "已报名" : "我要报名"}
      </button>

      {/* 评论区 */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">评论区</h3>

        {/* 评论列表 */}
        {comments.length === 0 ? (
          <p className="text-gray-500 mb-4">暂无评论，快来发表你的看法！</p>
        ) : (
          <ul className="space-y-3 mb-4">
            {comments.map((c, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded">
                <span className="font-semibold">{c.user}：</span>
                <span className="text-sm text-gray-600">{c.content}</span>
                <br />
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* 输入框 */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border p-2 rounded"
            placeholder="请输入评论..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={handleSubmitComment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            发布
          </button>
        </div>
      </div>
    </div>
  );
}
