import { NextRequest, NextResponse } from 'next/server';
import { faqDb } from '@/lib/db';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// 获取所有 FAQ
export async function GET() {
  try {
    const faqs = faqDb.findAll();
    return NextResponse.json({ data: faqs });
  } catch (error) {
    console.error('Get FAQs error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 创建 FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, keywords, category } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: '问题和答案不能为空' }, { status: 400 });
    }

    const faq = faqDb.create({
      id: generateId(),
      question,
      answer,
      keywords: keywords || null,
      category: category || null,
      enabled: 1
    });

    return NextResponse.json({ data: faq });
  } catch (error) {
    console.error('Create FAQ error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新 FAQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID 不能为空' }, { status: 400 });
    }

    const success = faqDb.update(id, updates);
    if (!success) {
      return NextResponse.json({ error: '更新失败' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update FAQ error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除 FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID 不能为空' }, { status: 400 });
    }

    const success = faqDb.delete(id);
    if (!success) {
      return NextResponse.json({ error: '删除失败' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
