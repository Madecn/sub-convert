# 群晖Docker部署指南

本指南将帮助你在群晖NAS上使用Docker部署sub-convert订阅转换工具。

## 前置要求

1. 群晖NAS已安装Docker套件
2. 群晖NAS支持SSH访问（可选，用于命令行操作）
3. 基本的Docker知识

## 部署方式

### 方式一：使用Docker Compose（推荐）

#### 1. 准备文件

在群晖File Station中创建一个文件夹，例如：`/volume1/docker/sub-convert/`

将以下文件上传到该文件夹：
- `Dockerfile`
- `docker-compose.yml`
- 整个项目源代码文件夹

#### 2. 通过SSH连接群晖

```bash
ssh admin@your-synology-ip
```

#### 3. 进入项目目录

```bash
cd /volume1/docker/sub-convert/
```

#### 4. 构建和启动容器

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 5. 访问服务

服务启动后，可以通过以下地址访问：
- **网页UI**：`http://your-synology-ip:8787/`
- **订阅转换**：`http://your-synology-ip:8787/sub?target=clash&url=YOUR_SUBSCRIPTION_URL`
- **健康检查**：`http://your-synology-ip:8787/health`
- **API文档**：`http://your-synology-ip:8787/api`

### 方式二：使用群晖Docker GUI

#### 1. 构建镜像

1. 打开群晖Docker套件
2. 点击"映像" → "新增" → "从Dockerfile新增"
3. 选择项目文件夹
4. 设置镜像名称：`sub-convert`
5. 点击"下一步"开始构建

#### 2. 创建容器

1. 构建完成后，点击"映像"中的`sub-convert`镜像
2. 点击"启动"
3. 设置容器名称：`sub-convert`
4. 端口设置：
   - 本地端口：`8787`
   - 容器端口：`8787`
5. 环境变量设置（可选）：
   ```
   NODE_ENV=production
   BACKEND=https://your-backend-url.com
   REMOTE_CONFIG=https://your-remote-config.com
   ```
6. 点击"应用"启动容器

## 环境变量配置

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `production` | ❌ |
| `PORT` | 服务端口 | `8787` | ❌ |
| `BACKEND` | 转换时的后端服务地址 | `https://url.v1.mk` | ❌ |
| `REMOTE_CONFIG` | 自定义远程配置 | 无 | ❌ |
| `DB` | 短链服务数据库URL | 无 | ❌ |

## 功能限制

### Node.js环境限制

在Node.js环境中，以下功能不可用：
- **短链服务**：需要Cloudflare D1数据库支持
- **数据库功能**：D1数据库仅在Cloudflare Workers环境中可用

### 可用功能

- ✅ **订阅转换**：完全支持Clash、sing-box、v2ray格式
- ✅ **订阅头信息**：支持subscription-userinfo头信息传递
- ✅ **网页UI**：完整的图形用户界面
- ✅ **健康检查**：服务状态监控
- ✅ **API文档**：完整的API说明（访问 `/api` 端点）

## 使用示例

### 订阅转换

```bash
# Clash格式转换
curl "http://your-synology-ip:8787/sub?target=clash&url=YOUR_SUBSCRIPTION_URL"

# sing-box格式转换
curl "http://your-synology-ip:8787/sub?target=singbox&url=YOUR_SUBSCRIPTION_URL"

# v2ray格式转换
curl "http://your-synology-ip:8787/sub?target=v2ray&url=YOUR_SUBSCRIPTION_URL"
```

### 健康检查

```bash
curl "http://your-synology-ip:8787/health"
```

### API文档

```bash
curl "http://your-synology-ip:8787/api"
```

### 短链服务（不可用）

短链服务在Node.js环境中不可用，会返回501错误：

```bash
# 创建短链（不可用）
curl -X POST "http://your-synology-ip:8787/short" \
  -H "Content-Type: application/json" \
  -d '{"long_url": "YOUR_LONG_SUBSCRIPTION_URL"}'
# 返回: {"error": "Short URL service requires database support. Not available in Node.js environment."}

# 短链重定向（不可用）
curl "http://your-synology-ip:8787/SHORT_CODE"
# 返回: {"error": "Short URL service requires database support. Not available in Node.js environment."}
```

## 管理命令

### 查看容器状态

```bash
docker-compose ps
```

### 查看日志

```bash
# 实时查看日志
docker-compose logs -f

# 查看最近100行日志
docker-compose logs --tail=100
```

### 重启服务

```bash
docker-compose restart
```

### 停止服务

```bash
docker-compose down
```

### 更新服务

```bash
# 拉取最新代码后
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 故障排除

### 1. 端口冲突

如果8787端口被占用，可以修改`docker-compose.yml`中的端口映射：

```yaml
ports:
  - "8788:8787"  # 改为8788或其他可用端口
```

### 2. 权限问题

确保Docker用户有足够的权限访问项目文件夹：

```bash
chmod -R 755 /volume1/docker/sub-convert/
```

### 3. 内存不足

如果遇到内存不足问题，可以在群晖Docker设置中增加内存限制。

### 4. 网络问题

确保群晖防火墙允许8787端口访问。

## 安全建议

1. **更改默认端口**：建议使用非标准端口
2. **设置访问控制**：在群晖防火墙中限制访问IP
3. **定期更新**：及时更新Docker镜像和代码
4. **备份配置**：定期备份重要的配置文件

## 性能优化

1. **资源限制**：在Docker设置中合理分配CPU和内存
2. **日志轮转**：配置日志轮转避免磁盘空间不足
3. **缓存优化**：对于频繁访问的订阅，考虑添加缓存机制

## 监控

可以通过以下方式监控服务状态：

1. **健康检查**：定期访问`/health`端点
2. **日志监控**：设置日志告警
3. **资源监控**：通过群晖资源监控查看容器资源使用情况

## 支持

如果遇到问题，可以：

1. 查看容器日志：`docker-compose logs -f`
2. 检查网络连接：`docker-compose exec sub-convert ping google.com`
3. 进入容器调试：`docker-compose exec sub-convert sh`
4. 提交Issue到项目仓库 