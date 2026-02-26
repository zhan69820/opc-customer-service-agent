import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'customer-service.db');
import fs from 'fs';

// 确保 data 目录存在
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT,
    category TEXT,
    enabled INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    source TEXT DEFAULT 'web',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  );
`);

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string | null;
  category: string | null;
  enabled: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string | null;
  source: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// FAQ 操作
export const faqDb = {
  findAll(): FAQ[] {
    return db.prepare('SELECT * FROM faqs WHERE enabled = 1 ORDER BY created_at DESC').all() as FAQ[];
  },

  findById(id: string): FAQ | undefined {
    return db.prepare('SELECT * FROM faqs WHERE id = ?').get(id) as FAQ | undefined;
  },

  create(faq: Omit<FAQ, 'created_at'>): FAQ {
    const stmt = db.prepare(`
      INSERT INTO faqs (id, question, answer, keywords, category, enabled)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(faq.id, faq.question, faq.answer, faq.keywords, faq.category, faq.enabled);
    return this.findById(faq.id)!;
  },

  update(id: string, faq: Partial<FAQ>): boolean {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (faq.question !== undefined) { fields.push('question = ?'); values.push(faq.question); }
    if (faq.answer !== undefined) { fields.push('answer = ?'); values.push(faq.answer); }
    if (faq.keywords !== undefined) { fields.push('keywords = ?'); values.push(faq.keywords); }
    if (faq.category !== undefined) { fields.push('category = ?'); values.push(faq.category); }
    if (faq.enabled !== undefined) { fields.push('enabled = ?'); values.push(faq.enabled); }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const stmt = db.prepare(`UPDATE faqs SET ${fields.join(', ')} WHERE id = ?`);
    return stmt.run(...values).changes > 0;
  },

  delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM faqs WHERE id = ?');
    return stmt.run(id).changes > 0;
  },

  search(keyword: string): FAQ[] {
    const pattern = `%${keyword}%`;
    return db.prepare(`
      SELECT * FROM faqs 
      WHERE enabled = 1 AND (
        question LIKE ? OR 
        answer LIKE ? OR 
        keywords LIKE ?
      )
    `).all(pattern, pattern, pattern) as FAQ[];
  }
};

// 对话操作
export const conversationDb = {
  create(conversation: Omit<Conversation, 'created_at'>): Conversation {
    const stmt = db.prepare(`
      INSERT INTO conversations (id, user_id, source)
      VALUES (?, ?, ?)
    `);
    stmt.run(conversation.id, conversation.user_id, conversation.source);
    return db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversation.id) as Conversation;
  },

  addMessage(message: Omit<Message, 'created_at'>): Message {
    const stmt = db.prepare(`
      INSERT INTO messages (id, conversation_id, role, content)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(message.id, message.conversation_id, message.role, message.content);
    return db.prepare('SELECT * FROM messages WHERE id = ?').get(message.id) as Message;
  },

  getMessages(conversationId: string): Message[] {
    return db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC')
      .all(conversationId) as Message[];
  }
};

export default db;
