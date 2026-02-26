import { faqDb } from './db';
import { FAQ } from './db';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// MiniMax API 配置
const MINIMAX_API_KEY = 'sk-api-eC-zjzdaRShO2qKjHAf9RRHa6CiZc2KfaAb-ut9CdLOHRpK2fLXEoipw_GFQH4vvqlyooBnpDJUCMmGBb6IqVMQtB0Dorke70Wo3o8jOm5t-j7jpijgaydM';
const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_pro_2';

interface MiniMaxMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 对话引擎 - 真正的 AI 客服
export class ChatEngine {
  private faqs: FAQ[] = [];
  
  constructor() {
    this.reloadKnowledgeBase();
  }

  // 重新加载知识库
  reloadKnowledgeBase() {
    this.faqs = faqDb.findAll();
  }

  // 构建知识库上下文（作为 AI 的参考资料）
  private buildKnowledgeContext(): string {
    if (this.faqs.length === 0) {
      return '你是一个友好、专业的客服，请根据你的知识回答用户的问题。';
    }

    const faqList = this.faqs
      .map((faq, i) => `【参考${i + 1}】问题：${faq.question}，回答：${faq.answer}`)
      .join('\n');

    return `你是一个专业、友好的智能客服。请根据以下知识库参考信息回答用户的问题。如果知识库中有相关信息，优先使用知识库回答；如果没有，请根据你的理解正常回答。

知识库参考：
${faqList}

请用专业、友好的语气回答用户问题。`;
  }

  // 调用 MiniMax API
  private async callMiniMax(messages: MiniMaxMessage[]): Promise<string> {
    try {
      const response = await fetch(MINIMAX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MINIMAX_API_KEY}`
        },
        body: JSON.stringify({
          model: 'abab6.5s-chat',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      
      console.error('MiniMax API response:', data);
      return null;
    } catch (error) {
      console.error('MiniMax API error:', error);
      return null;
    }
  }

  // AI 回复（直接回答，不依赖知识库匹配）
  private async aiReply(userMessage: string, history: ChatMessage[]): Promise<string> {
    // 构建消息列表
    const messages: MiniMaxMessage[] = [
      {
        role: 'system',
        content: this.buildKnowledgeContext()
      }
    ];

    // 添加历史消息（最近3轮，保持上下文）
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }

    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: userMessage
    });

    console.log(`[AI] Calling MiniMax with ${messages.length} messages`);

    // 调用 API
    const reply = await this.callMiniMax(messages);
    
    if (reply) {
      return reply;
    }

    // API 失败时的兜底回复
    const fallbackReplies = [
      "感谢您的咨询！请问还有什么可以帮您的？",
      "明白啦～您还有其他问题吗？",
      "好的，如果您有任何问题，随时问我哦！",
    ];
    
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }

  // 主对话方法 - 直接让 AI 回答
  async chat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    console.log(`[Chat] User: "${userMessage}" (${this.faqs.length} FAQs in knowledge base)`);

    // 直接调用 AI 回答，知识库作为背景参考
    const reply = await this.aiReply(userMessage, history);
    console.log(`[Chat] AI: "${reply.substring(0, 50)}..."`);
    
    return reply;
  }
}

// 单例
export const chatEngine = new ChatEngine();
