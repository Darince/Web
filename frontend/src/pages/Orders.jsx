import { useEffect, useState } from "react";

export default function Orders({ user, joinedActivities, setJoinedActivities }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    fetch(`/api/users/${user}/orders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        }
      })
      .catch((err) => {
        console.error("获取订单失败", err);
      });
  }, [user]);

  const handleCancel = async (activityId) => {
    if (!window.confirm("确定要取消报名这个活动吗？")) return;

    try {
      const res = await fetch(`/api/activities/${activityId}/join`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((act) => act.id !== activityId));
        // 2. 重新拉取该用户的报名记录并更新 joinedActivities（需传入 setJoinedActivities）
        fetch(`/api/users/${user}/orders`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const ids = data.data.map((a) => a.id);
              setJoinedActivities(ids); // ✅ ✅ ✅
            }
          });
        alert("取消成功");
      } else {
        alert(data.message || "取消失败");
      }
    } catch (err) {
      console.error("取消失败", err);
      alert("请求失败，请稍后重试");
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-red-600">请先登录后查看您的报名记录。</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">我的订单</h2>
      {orders.length === 0 ? (
        <p>您还没有报名任何活动。</p>
      ) : (
        <div className="space-y-4">
          {orders.map((activity) => (
            <div key={activity.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">{activity.title}</h3>
              <p className="text-sm text-gray-500">
                {activity.time} | {activity.location}
              </p>
              <p className="mt-2">{activity.description}</p>

              <button
                onClick={() => handleCancel(activity.id)}
                className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                取消报名
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
