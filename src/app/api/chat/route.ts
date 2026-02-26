import { NextRequest, NextResponse } from 'next/server';
import { chatEngine } from '@/lib/chat-engine';
import { conversationDb, faqDb } from '@/lib/db';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId = 'anonymous', conversationId, source = 'web' } = body;

    if (!message) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }

    // 获取或创建会话
    let convId = conversationId;
    if (!convId) {
      const conv = conversationDb.create({
        id: generateId(),
        user_id: userId,
        source
      });
      convId = conv.id;
    }

    // 保存用户消息
    conversationDb.addMessage({
      id: generateId(),
      conversation_id: convId,
      role: 'user',
      content: message
    });

    // 获取历史消息
    const history = conversationDb.getMessages(convId).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    // 调用对话引擎
    const reply = await chatEngine.chat(message, history);

    // 保存助手回复
    conversationDb.addMessage({
      id: generateId(),
      conversation_id: convId,
      role: 'assistant',
      content: reply
    });

    return NextResponse.json({
      reply,
      conversationId: convId
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
