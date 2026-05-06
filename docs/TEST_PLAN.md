# TEST_PLAN

## 后端检查

1. 启动 MySQL：

```bash
docker compose up -d mysql
```

2. 初始化后端：

```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

3. 检查健康接口：

```bash
curl http://127.0.0.1:3000/health
```

体验环境可检查：

```bash
curl http://bkeel.com:5300/health
```

## 小程序检查

1. 微信开发者工具打开 `miniprogram/`。
2. 默认进入登录页。
3. 新用户可注册账号名、密码和昵称。
4. 老用户可用账号名和密码登录。
5. 登录后进入班级选择页。
6. `班级列表` Tab 显示新手指引和全部班级，未加入班级优先。
7. `我的班级` Tab 显示已加入班级，卡片右侧显示管理员/成员身份。
8. 创建班级入口位于 `我的班级` Tab 底部。
9. 创建班级 / 申请入班 / 审核 / 发日记 / 评论 / 点赞 / 举报 / 通知 / 管理闭环可走通。

## 账号与班级流程

- 注册账号后可查看公开班级列表。
- 任何登录用户都可以创建班级。
- 创建者自动成为该班级管理员。
- 其他用户申请加入后状态为审核中。
- 管理员通过申请后，申请人可进入该班级。
- 管理员拒绝申请后，申请人可重新申请。

## 权限检查

- 未登录不可访问业务接口。
- 未审核通过不可访问班级内容。
- 非管理员不可访问管理接口和管理页面。
- 普通成员看不到匿名真实作者。
- 管理员可在管理页看到匿名真实作者。
- 被禁言用户不能发日记、评论和回复。
- 管理员不能移除自己、禁言自己或取消最后一个管理员。

## 图片检查

- 可上传 `jpg/jpeg/png/webp` 图片。
- 单张超过 5MB 时应提示失败。
- HEIC/HEIF 不支持时应提示用户转换格式。
- 上传成功后图片路径应类似 `/uploads/YYYY-Www/xxxx.jpg`。
- 日记列表和详情页可正常显示他人上传图片。
- 点击图片可全屏预览。

## 通知检查

- 点赞他人日记产生通知。
- 评论他人日记产生通知。
- 回复他人评论产生通知。
- 通知页显示未读状态。
- 点击通知可进入对应日记。
- 关联评论的通知进入详情后可高亮评论或回复。
- 从日记详情返回后仍回到通知列表。

## GitHub 发布检查

提交前确认以下内容没有被 Git 跟踪：

- `server/.env`
- `server/node_modules/`
- `server/uploads/` 中的用户图片
- `server/server.log`
- `server/server.pid`
- `miniprogram/project.private.config.json`
- `.DS_Store` 和 `._*`
