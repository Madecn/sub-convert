# 使用Node.js 18 Alpine作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app
# 设置 npm registry 环境变量
# ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/
# 安装pnpm
RUN npm config set registry https://registry.npmmirror.com

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile --prefer-offline

# 复制源代码
COPY . .

# 构建项目（使用Node.js配置）
RUN pnpm build:node

# 安装生产依赖
RUN pnpm install --prod --frozen-lockfile --prefer-offline

# 暴露端口
EXPOSE 8787

# 启动命令
CMD ["node", "--max-http-header-size=16384", "dist/index.js"]