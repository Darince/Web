import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

export default function Header({ user, setUser }) {
  const [showModal, setShowModal] = useState(false);
  const [authType, setAuthType] = useState("login");

  const handleOpen = (type) => {
    setAuthType(type);
    setShowModal(true);
  };

  const handleLogout = () => setUser(null);

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">体育活动室</h1>
      <nav className="flex gap-4 items-center">
        <Link to="/">主页</Link>
        <Link to="/activities">活动</Link>
        <Link to="/orders">订单</Link>
        <Link to="/search">搜索</Link>

        {!user ? (
          <>
            <button
              onClick={() => handleOpen("register")}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              注册
            </button>
            <button
              onClick={() => handleOpen("login")}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              登录
            </button>
          </>
        ) : (
          <>
            <span className="text-sm">欢迎，{user}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              登出
            </button>
          </>
        )}
      </nav>

      {showModal && (
        <AuthModal
          type={authType}
          onClose={() => setShowModal(false)}
          onAuth={(username) => setUser(username)}
        />
      )}

      {user === "admin" && (
        <Link
          to="/admin/add"
          className="ml-4 text-sm bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"
        >
          添加活动
        </Link>
      )}
    </header>
  );
}
