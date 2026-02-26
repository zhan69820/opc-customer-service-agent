# GitHub 上传指南

## 你需要做的步骤：

### 1. 创建 GitHub 仓库
1. 打开 https://github.com/new
2. 仓库名：`opc-customer-service-agent`
3. 描述：`OPC 智能客服 Agent - 基于 AI 的客服解决方案`
4. 选择 **Public**
5. 点击 "Create repository"

### 2. 推送代码

在本地终端执行：

```bash
cd /Users/guest123/.openclaw/workspace/opc/tasks/customer-service-agent

# 关联你的 GitHub 仓库（把下面的 URL 换成你创建的仓库地址）
git remote add origin https://github.com/你的用户名/opc-customer-service-agent.git

# 推送到 GitHub
git push -u origin main
```

### 3. 完成！

---

## 项目结构（上传后）

```
opc-customer-service-agent/
├── src/
│   ├── app/
│   │   ├── admin/        # 管理后台
│   │   ├── chat/        # 客服聊天页面
│   │   └── api/         # API 接口
│   └── lib/
│       ├── chat-engine.ts  # 对话引擎
│       └── db.ts          # 数据库
├── public/
├── Dockerfile           # Docker 镜像
├── docker-compose.yml  # 一键部署
├── deploy.sh           # 部署脚本
├── DEPLOY.md           # 部署文档
└── README.md           # 项目说明
```

---

## 后续更新流程

每次代码更新后：

```bash
git add .
git commit -m "更新说明"
git push
```

---

## GitHub 地址

创建好仓库后告诉我，我帮你把 deploy.sh 里的下载链接改成你实际的仓库地址。
