import { Controller, Post, Get, Body, Param } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { getDB } from '../utils/db';
import { Activity } from '../model/activity.model';

@Controller('/api/users')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    if (!username || !password) {
      return { success: false, message: '用户名或密码不能为空' };
    }

    return await this.userService.createUser(username, password);
  }
  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    if (!username || !password) {
      return { success: false, message: '用户名或密码不能为空' };
    }

    return await this.userService.loginUser(username, password);
  }

  @Get('/:username/orders')
  async getUserOrders(@Param('username') username: string) {
    const db = await getDB();

    // 1. 获取报名的活动 ID
    const idRows = db.exec(`
      SELECT activity_id FROM user_activity WHERE user = '${username}'
    `);

    if (idRows.length === 0) {
      return { success: true, data: [] };
    }

    const ids = idRows[0].values.map(row => row[0]); // 提取活动ID数组

    // 2. 获取完整活动信息
    const placeholders = ids.map(() => '?').join(', ');
    const stmt = db.prepare(`SELECT * FROM activities WHERE id IN (${placeholders})`);
    stmt.bind(ids);

    const result: Activity[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      result.push({
        id: Number(row.id),
        title: row.title,
        time: row.time,
        location: row.location,
        description: row.description
      });
    }
    stmt.free();

    return { success: true, data: result };
  }
}
