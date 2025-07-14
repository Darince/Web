import { Provide } from '@midwayjs/core';
import { getDB, saveDB } from '../utils/db';

@Provide()
export class UserService {
  async createUser(
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    const db = await getDB();

    // 检查是否存在该用户名
    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    stmt.bind([username]);
    if (stmt.step()) {
      stmt.free();
      return { success: false, message: '用户名已存在' };
    }
    stmt.free();

    // 插入用户
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [
      username,
      password,
    ]);

    // 持久化保存
    saveDB();

    return { success: true, message: '注册成功' };
  }
  async loginUser(
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    const db = await getDB();

    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    stmt.bind([username]);

    if (stmt.step()) {
      const storedPassword = stmt.getAsObject().password;
      stmt.free();

      if (storedPassword === password) {
        return { success: true, message: '登录成功' };
      } else {
        return { success: false, message: '密码错误' };
      }
    } else {
      stmt.free();
      return { success: false, message: '用户不存在' };
    }
  }
}
