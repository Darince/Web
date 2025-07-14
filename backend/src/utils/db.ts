import initSqlJs from 'sql.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const dbPath = join(__dirname, '../../data/database.sqlite');

let dbInstance: any = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  // 加载已有 .sqlite 文件
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        activity_id INTEGER NOT NULL
      );
    `);

    // 创建活动表
    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);

    // 插入三条初始活动数据
    dbInstance.run(`
      INSERT INTO activities (id, title, time, location, description) VALUES
        (1, '篮球比赛', '2025-07-20', '体育馆 A', '全校篮球友谊赛，欢迎报名！'),
        (2, '羽毛球友谊赛', '2025-07-22', '羽毛球馆', '业余羽毛球选手交流赛'),
        (3, '乒乓球单打赛', '2025-07-25', '室内乒乓球馆', '快来挑战最强乒乓王！');
    `);

    // 创建评论表
    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_id INTEGER NOT NULL,
        user TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    saveDB(); // 初始化后保存一次
  }

  return dbInstance;
}

// 每次变动后调用此函数进行保存
export function saveDB() {
  if (!dbInstance) return;
  const binaryArray = dbInstance.export();
  mkdirSync(join(__dirname, '../../data'), { recursive: true });
  writeFileSync(dbPath, Buffer.from(binaryArray));
}
