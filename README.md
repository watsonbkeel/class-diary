# 班级日记本小程序

`class-diary-miniapp` 是一个面向班级内部使用的微信原生小程序，配套 Node.js Express 后端、Prisma ORM 和 MySQL 数据库。同班同学可以发布日记、匿名互动、评论回复、点赞、接收通知和举报内容；班级管理员可以审核入班申请、管理成员、处理举报并追溯匿名内容真实作者。

## 当前版本状态

- 登录方式：账号名 + 密码注册/登录，首次打开必须注册账号。
- 班级发现：登录后可在首页查看全部班级列表，未加入班级优先展示。
- 加入规则：申请加入班级后需要班级管理员审核。
- 创建规则：任何登录用户都可以创建班级，创建者自动成为该班级管理员。
- 首页结构：`班级列表` / `我的班级` 双 Tab；新手指引在班级列表页上方，创建班级入口在我的班级底部。
- 部署现状：小程序端当前指向 `http://bkeel.com:5300`，API 前缀为 `http://bkeel.com:5300/api`。

## 技术栈

- 微信小程序原生开发：JavaScript / WXML / WXSS
- Node.js + Express
- Prisma 6 + MySQL 8.0
- JWT 认证
- Multer 本地图片上传
- Docker Compose MySQL

## 项目结构

```text
class-diary-miniapp/
  docker-compose.yml
  docs/
  server/
    prisma/
    src/
    uploads/
  miniprogram/
```

## 核心功能

- 账号密码注册和登录
- 公开班级列表、邀请码查询、申请入班、管理员审核
- 多班级切换和班级昵称
- 日记发布、匿名展示、最多 9 张图片
- 评论、二级回复、点赞、举报
- 通知中心，点击通知可进入关联日记继续互动
- 小程序内管理员页面：入班申请、成员管理、举报处理
- 图片按 ISO 周目录保存，例如 `/uploads/2026-W18/xxxx.jpg`

## 本地开发

### 1. 启动 MySQL

```bash
docker compose up -d mysql
```

### 2. 初始化后端

```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

本地后端默认地址：

```text
http://127.0.0.1:3000
```

### 3. 打开小程序

使用微信开发者工具打开：

```text
miniprogram/
```

开发环境可在 `miniprogram/utils/config.js` 中调整：

```js
const PUBLIC_BASE_URL = 'http://127.0.0.1:3000'
const API_BASE_URL = 'http://127.0.0.1:3000/api'
```

当前体验环境使用：

```js
const PUBLIC_BASE_URL = 'http://bkeel.com:5300'
const API_BASE_URL = 'http://bkeel.com:5300/api'
```

## 后端环境变量

复制 `server/.env.example` 为 `server/.env`，并按实际环境修改：

```env
PORT=3000
DATABASE_URL="mysql://class_diary_user:class_diary_password_change_me@127.0.0.1:3306/class_diary"
JWT_SECRET="replace_with_a_long_random_secret"
WECHAT_APPID="your_wechat_appid"
WECHAT_SECRET="your_wechat_secret"
UPLOAD_DIR="./uploads"
PUBLIC_BASE_URL="http://127.0.0.1:3000"
```

注意：`server/.env` 不应提交到 GitHub，只提交 `server/.env.example`。

## 关键权限规则

- 未登录用户不能访问业务接口。
- 未审核通过的用户不能访问班级内容。
- 普通成员不能访问管理员接口。
- 普通接口不返回匿名真实作者。
- 班级管理员可以在管理功能中查看匿名真实作者。
- 管理员不能移除自己、禁言自己或取消最后一个管理员。
- 被禁言成员不能发布日记、评论或回复。

## GitHub 发布注意

本仓库通过 `.gitignore` 排除了以下内容：

- `server/.env` 等本地环境变量
- `server/node_modules/` 依赖目录
- `server/uploads/` 中的用户上传图片
- `server/server.log`、`server/server.pid` 等运行产物
- `miniprogram/project.private.config.json` 微信开发者工具本地配置
- `.DS_Store`、`._*` 等系统元数据

更多设计、接口和测试说明见 `docs/`。
