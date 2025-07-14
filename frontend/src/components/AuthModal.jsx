import { useState } from "react";
import axios from "axios";

export default function AuthModal({ type = "login", onClose, onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }

    try {
      let res;

      if (type === "register") {
        res = await axios.post("/api/users/register", { username, password });
      } else if (type === "login") {
        res = await axios.post("/api/users/login", { username, password });
      }

      if (res?.data?.success) {
        onAuth(username); // ✅ 通知 Header 登录状态
        onClose(); // ✅ 关闭模态框
      } else {
        setError(res.data?.message || "登录/注册失败");
      }
    } catch (err) {
      console.error(err);
      setError("请求失败，请稍后再试");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">
          {type === "login" ? "登录" : "注册"}
        </h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="用户名"
          className="w-full border p-2 mb-3 rounded text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          className="w-full border p-2 mb-3 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {type === "login" ? "登录" : "注册"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-500 hover:underline"
        >
          取消
        </button>
      </div>
    </div>
  );
}
