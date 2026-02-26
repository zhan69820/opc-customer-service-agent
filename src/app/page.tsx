import Link from 'next/link';
import { MessageCircle, Settings, ArrowRight, Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
            <Bot className="w-4 h-4" />
            AI 客服 Agent
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            OPC 智能客服 Agent
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            基于 AI 的智能客服解决方案，7×24 小时在线，自动回答客户问题
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              体验客服聊天
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium border"
            >
              <Settings className="w-5 h-5" />
              管理后台
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">智能问答</h3>
            <p className="text-gray-600">
              基于知识库的智能对话，准确回答客户常见问题
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">轻松管理</h3>
            <p className="text-gray-600">
              可视化管理后台，快速添加和更新问答知识库
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">多平台接入</h3>
            <p className="text-gray-600">
              支持网页、微信等多渠道接入，统一管理
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">立即开始使用</h2>
          <p className="text-blue-100 mb-6">
            ¥99/月，省去人工客服成本，让 AI 为您服务
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
          >
            免费试用
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
