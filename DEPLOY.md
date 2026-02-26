# 一键部署教程

## 方式一：Docker 部署（推荐）

### 前置要求
- 服务器（任何云服务器均可）
- 安装 Docker

### 部署步骤

```bash
# 1. 创建项目目录
mkdir -p /opt/opc-customer-service
cd /opt/opc-customer-service

# 2. 一键启动
curl -s https://raw.githubusercontent.com/your-repo/deploy.sh | bash
```

### 访问
- 客服聊天：http://你的服务器IP:3000/chat
- 管理后台：http://你的服务器IP:3000/admin

---

## 方式二：Docker Compose 部署

### 1. 创建配置文件

```bash
mkdir -p /opt/opc-customer-service
cd /opt/opc-customer-service

# 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    image: opc/customer-service-agent:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      # MiniMax API Key（可选，接入AI）
      - MINIMAX_API_KEY=your-api-key-here
    volumes:
      - ./data:/app/data
    restart: always

  # Nginx 反向代理（可选）
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    restart: always
EOF
```

### 2. 启动服务

```bash
docker-compose up -d
```

---

## 方式三：宝塔面板部署

### 1. 安装宝塔
```bash
# 登录服务器后执行宝塔安装命令
# 略（参考宝塔官方文档）
```

### 2. 通过宝塔部署
1. 登录宝塔面板
2. 找到 "Node.js 项目"
3. 点击 "部署"
4. 填写：
   - 项目路径：`/www/wwwroot/customer-service`
   - 启动命令：`npm start`
   - 端口：`3000`

### 3. 配置域名
1. 添加站点
2. 配置反向代理指向 127.0.0.1:3000

---

## 方式四：手动部署

### 1. 安装 Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 部署项目
```bash
# 克隆项目
git clone https://github.com/your-repo/customer-service-agent.git
cd customer-service-agent

# 安装依赖
npm install

# 构建
npm run build

# 配置环境变量
cp .env.example .env
nano .env  # 填写 API Key

# 启动（使用 PM2）
npm install -g pm2
pm2 start npm --name "customer-service" -- start
pm2 startup
pm2 save
```

---

## 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `NODE_ENV` | 否 | production |
| `MINIMAX_API_KEY` | 否 | AI 对话需要 |
| `PORT` | 否 | 默认 3000 |

---

## 部署检查清单

- [ ] 服务器系统正常
- [ ] 端口 3000 已开放（防火墙）
- [ ] 域名解析（如需域名访问）
- [ ] SSL 证书（可选，HTTPS）
- [ ] API Key 已配置（如需 AI 功能）

---

## 常见问题

### 1. 端口被占用
```bash
# 查找占用进程
lsof -i:3000
# 杀掉进程
kill -9 <PID>
```

### 2. 数据库权限问题
```bash
# 给 data 目录权限
chmod -R 755 ./data
chown -R 1000:1000 ./data
```

### 3. 启动失败
```bash
# 查看日志
docker logs <container-id>
# 或
pm2 logs
```
