import { Controller, Get, Post, Del, Param, Body } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { ActivityService } from '../service/activity.service';
import { getDB, saveDB } from '../utils/db';

@Controller('/api/activities')
export class ActivityController {
  @Inject()
  activityService: ActivityService;

  @Get('/')
  async list() {
    const db = await getDB();

    const stmt = db.prepare('SELECT * FROM activities ORDER BY id');
    const activities = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      activities.push(row);
    }

    stmt.free();

    return { success: true, data: activities };
  }

  @Post('/')
  async addActivity(
    @Body('username') username: string,
    @Body('title') title: string,
    @Body('time') time: string,
    @Body('location') location: string,
    @Body('description') description: string
  ) {
    if (username !== 'admin') {
      return { success: false, message: '权限不足，仅管理员可添加活动' };
    }

    if (!title || !time || !location || !description) {
      return { success: false, message: '缺少活动信息字段' };
    }

    const db = await getDB();

    // 生成新活动 ID（取最大值 + 1）
    const result = db.exec('SELECT MAX(id) AS maxId FROM activities');
    const maxId = result[0]?.values[0][0] || 0;
    const newId = Number(maxId) + 1;

    db.run(
      'INSERT INTO activities (id, title, time, location, description) VALUES (?, ?, ?, ?, ?)',
      [newId, title, time, location, description]
    );

    saveDB();

    return { success: true, message: '活动添加成功', id: newId };
  }

  @Del('/:id')
  async deleteActivity(
    @Param('id') activityId: number,
    @Body('username') username: string
  ) {
    if (username !== 'admin') {
      return { success: false, message: '权限不足，仅管理员可删除活动' };
    }

    const db = await getDB();

    // 删除活动
    db.run('DELETE FROM activities WHERE id = ?', [activityId]);

    // 删除报名记录
    db.run('DELETE FROM user_activity WHERE activity_id = ?', [activityId]);

    // 删除评论记录
    db.run('DELETE FROM comments WHERE activity_id = ?', [activityId]);

    saveDB();

    return { success: true, message: '活动已删除' };
  }

  @Post('/:id/join')
  async joinActivity(
    @Param('id') activityId: number,
    @Body('username') username: string
  ) {
    if (!username || !activityId) {
      return { success: false, message: '用户名或活动 ID 缺失' };
    }

    const db = await getDB();

    // ✅ 1. 检查用户是否存在
    const userStmt = db.prepare('SELECT * FROM users WHERE username = ?');
    userStmt.bind([username]);
    if (!userStmt.step()) {
      userStmt.free();
      return { success: false, message: '用户不存在' };
    }
    userStmt.free();

    // ✅ 2. 检查是否已报名
    const checkStmt = db.prepare(
      'SELECT * FROM user_activity WHERE user = ? AND activity_id = ?'
    );
    checkStmt.bind([username, activityId]);
    if (checkStmt.step()) {
      checkStmt.free();
      return { success: false, message: '你已经报名过该活动' };
    }
    checkStmt.free();

    // ✅ 3. 插入报名记录
    db.run('INSERT INTO user_activity (user, activity_id) VALUES (?, ?)', [
      username,
      activityId,
    ]);
    saveDB();

    return { success: true, message: '报名成功' };
  }
  // ✅ 新增：取消报名
  @Del('/:id/join')
  async cancelJoinActivity(
    @Param('id') activityId: number,
    @Body('username') username: string
  ) {
    if (!username || !activityId) {
      return { success: false, message: '用户名或活动 ID 缺失' };
    }

    const db = await getDB();

    // 删除报名记录
    const stmt = db.prepare(
      'DELETE FROM user_activity WHERE user = ? AND activity_id = ?'
    );
    stmt.run([username, activityId]);
    stmt.free();

    saveDB();

    return { success: true, message: '取消报名成功' };
  }

  // 发表评论
  @Post('/:id/comments')
  async addComment(
    @Param('id') activityId: number,
    @Body('username') username: string,
    @Body('content') content: string
  ) {
    if (!username || !content) {
      return { success: false, message: '用户名或评论内容不能为空' };
    }

    const db = await getDB();

    const now = new Date().toISOString();
    db.run(
      `INSERT INTO comments (activity_id, user, content, created_at) VALUES (?, ?, ?, ?)`,
      [activityId, username, content, now]
    );
    saveDB();

    return { success: true, message: '评论成功' };
  }

  // 获取评论列表
  @Get('/:id/comments')
  async getComments(@Param('id') activityId: number) {
    const db = await getDB();

    const stmt = db.prepare(
      'SELECT user, content, created_at FROM comments WHERE activity_id = ? ORDER BY created_at DESC'
    );
    stmt.bind([activityId]);

    const comments = [];
    while (stmt.step()) {
      comments.push(stmt.getAsObject());
    }
    stmt.free();

    return { success: true, data: comments };
  }
}
