'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, MessageCircle, Settings } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string | null;
  category: string | null;
  enabled: number;
}

export default function AdminDashboard() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [form, setForm] = useState({
    question: '',
    answer: '',
    keywords: '',
    category: ''
  });

  // 加载 FAQs
  const loadFaqs = async () => {
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setFaqs(data.data || []);
    } catch (error) {
      console.error('Load FAQs error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 保存 FAQ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingFaq ? `/api/faqs?id=${editingFaq.id}` : '/api/faqs';
    const method = editingFaq ? 'PUT' : 'POST';
    
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      setForm({ question: '', answer: '', keywords: '', category: '' });
      setShowForm(false);
      setEditingFaq(null);
      loadFaqs();
    } catch (error) {
      console.error('Save FAQ error:', error);
    }
  };

  // 删除 FAQ
  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这条问答吗？')) return;
    
    try {
      await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
      loadFaqs();
    } catch (error) {
      console.error('Delete FAQ error:', error);
    }
  };

  // 编辑 FAQ
  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      keywords: faq.keywords || '',
      category: faq.category || ''
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">OPC 客服 Agent - 管理后台</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.open('/chat', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <MessageCircle className="w-4 h-4" />
              客服聊天页面
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 添加按钮 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">知识库管理</h2>
          <button
            onClick={() => { setShowForm(!showForm); setEditingFaq(null); setForm({ question: '', answer: '', keywords: '', category: '' }); }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            添加问答
          </button>
        </div>

        {/* 添加/编辑表单 */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingFaq ? '编辑问答' : '添加新问答'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  问题 *
                </label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：你们什么时候发货？"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  回答 *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：订单确认后24小时内发货"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    关键词（逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：发货,物流,快递"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：物流"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingFaq ? '保存修改' : '添加'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQ 列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : faqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              暂无问答，点击上方按钮添加
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">问题</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">回答</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">关键词</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{faq.question}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{faq.answer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {faq.keywords?.split(',').map(k => (
                        <span key={k} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-1">
                          {k.trim()}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-1 text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
