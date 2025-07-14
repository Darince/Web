import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import Orders from "./pages/Orders";
import Search from "./pages/Search";
import AddActivity from "./pages/AddActivity";

export default function App() {
  const [user, setUser] = useState(null);
  const [joinedActivities, setJoinedActivities] = useState([]);

  const [comments, setComments] = useState({
    1: [{ user: "Alice", text: "真期待！" }],
    2: [],
    3: [],
  });

  // ✅ 每次用户登录或切换时，从后端刷新已报名活动
  useEffect(() => {
    if (!user) {
      setJoinedActivities([]);
      return;
    }

    axios
      .get(`/api/users/${user}/orders`)
      .then((res) => {
        if (res.data.success) {
          const ids = res.data.data.map((activity) => activity.id);
          setJoinedActivities(ids);
        }
      })
      .catch((err) => {
        console.error("获取报名记录失败", err);
      });
  }, [user]);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/activities"
          element={
            <Activities user={user} joinedActivities={joinedActivities} />
          }
        />
        <Route
          path="/activities/:id"
          element={
            <ActivityDetail
              user={user}
              joinedActivities={joinedActivities}
              setJoinedActivities={setJoinedActivities}
              comments={comments}
              setComments={setComments}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <Orders
              user={user}
              joinedActivities={joinedActivities}
              setJoinedActivities={setJoinedActivities}
            />
          }
        />
        <Route
          path="/search"
          element={<Search user={user} joinedActivities={joinedActivities} />}
        />
        <Route path="/admin/add" element={<AddActivity user={user} />} />
      </Routes>
    </Router>
  );
}
