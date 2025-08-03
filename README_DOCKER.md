# sub-convert Docker部署

这是一个订阅转换工具的Docker部署版本，支持在群晖NAS等Docker环境中运行。

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/sub-convert.git
cd sub-convert
```

### 2. 一键部署

```bash
# 给部署脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 3. 手动部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 访问地址

- **网页UI**: http://your-ip:8787
- **订阅转换**: http://your-ip:8787/sub?target=clash&url=YOUR_SUBSCRIPTION_URL
- **健康检查**: http://your-ip:8787/health

## 使用示例

### 订阅转换

```bash
# Clash格式
curl "http://your-ip:8787/sub?target=clash&url=YOUR_SUBSCRIPTION_URL"

# sing-box格式
curl "http://your-ip:8787/sub?target=singbox&url=YOUR_SUBSCRIPTION_URL"

# v2ray格式
curl "http://your-ip:8787/sub?target=v2ray&url=YOUR_SUBSCRIPTION_URL"
```

### 健康检查

```bash
curl "http://your-ip:8787/health"
```

### API文档

```bash
curl "http://your-ip:8787/api"
```

## 功能说明

### ✅ 可用功能
- **订阅转换**：支持Clash、sing-box、v2ray格式
- **订阅头信息**：支持subscription-userinfo头信息传递
- **网页UI**：完整的图形用户界面
- **健康检查**：服务状态监控
- **API文档**：完整的API说明

### ❌ 不可用功能
- **短链服务**：需要Cloudflare D1数据库，在Node.js环境中不可用
- **数据库功能**：D1数据库仅在Cloudflare Workers环境中可用

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | 8787 |
| `BACKEND` | 后端服务地址 | https://url.v1.mk |
| `REMOTE_CONFIG` | 远程配置 | 无 |

## 管理命令

```bash
# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新服务
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 群晖NAS部署

### 方式一：SSH命令行

1. 通过SSH连接群晖
2. 上传项目文件到 `/volume1/docker/sub-convert/`
3. 运行部署命令

### 方式二：Docker GUI

1. 打开群晖Docker套件
2. 从Dockerfile构建镜像
3. 创建容器并配置端口映射

详细步骤请参考 [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)

## 故障排除

### 端口冲突
修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8788:8787"  # 改为8788
```

### 权限问题
```bash
chmod -R 755 /volume1/docker/sub-convert/
```

### 查看详细日志
```bash
docker-compose logs --tail=100
```

## 支持

- 查看详细部署文档：[DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)
- 提交Issue到项目仓库
- 查看容器日志进行调试 