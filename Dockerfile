FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制代码
COPY . .

# 构建
RUN npm run build

# 创建 data 目录
RUN mkdir -p data

# 暴露端口
EXPOSE 3000

# 启动
CMD ["npm", "start"]
