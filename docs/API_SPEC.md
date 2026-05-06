# API_SPEC

## 基础约定

- 接口前缀：`/api`
- 认证头：`Authorization: Bearer <token>`
- 成功返回：`{ success, data, message }`
- 失败返回：`{ success: false, error: { code, message } }`
- 当前版本主登录方式为账号名 + 密码注册登录。
- `/api/auth/wechat-login` 保留为兼容路由，但当前返回 `WECHAT_LOGIN_DISABLED`，提示使用账号密码登录。

## Auth

### 注册

```http
POST /api/auth/register
```

请求示例：

```json
{
  "accountName": "watson",
  "password": "your_password",
  "nickname": "Watson"
}
```

返回 `token` 和当前用户信息。注册账号默认不是全局管理员。

### 登录

```http
POST /api/auth/login
```

请求示例：

```json
{
  "accountName": "watson",
  "password": "your_password"
}
```

### 当前用户

- `GET /api/auth/me`
- `PATCH /api/auth/me`

`PATCH /api/auth/me` 可修改全局昵称和头像。

## Class

- `POST /api/classes`：任何登录用户都可创建班级，创建者自动成为该班级管理员。
- `GET /api/classes`：公开班级列表；返回全部班级，包含当前用户的 `joinStatus`、`role`、成员数和日记数。
- `GET /api/classes/my`：我的班级列表，只返回已加入的班级。
- `GET /api/classes/by-invite/:inviteCode`：通过邀请码查询班级。
- `PATCH /api/classes/:classId/nickname`：修改当前用户在该班级的班级昵称。
- `POST /api/classes/:classId/join-requests`：申请加入班级，需管理员审核。

`GET /api/classes` 返回字段示例：

```json
{
  "id": 1,
  "name": "六6班",
  "description": "班级描述",
  "inviteCode": "ABC123",
  "memberCount": 12,
  "diaryCount": 34,
  "role": "member",
  "classNickname": "小明",
  "isMuted": false,
  "joinedAt": "2026-05-06T00:00:00.000Z",
  "joinStatus": "joined",
  "joinRequestId": 10
}
```

`joinStatus` 可能为：`none`、`pending`、`approved`、`rejected`、`joined`。

## Diary

- `GET /api/classes/:classId/diaries`
- `POST /api/classes/:classId/diaries`
- `GET /api/diaries/:diaryId`
- `DELETE /api/diaries/:diaryId`

日记支持实名/匿名、图片列表和软删除。普通接口不会返回匿名内容真实作者；管理员视角可在管理功能中追溯。

## Comment

- `GET /api/diaries/:diaryId/comments`
- `POST /api/diaries/:diaryId/comments`
- `DELETE /api/comments/:commentId`

评论支持二级回复、匿名评论和软删除。

## Like

- `POST /api/diaries/:diaryId/like`
- `POST /api/comments/:commentId/like`

同一用户对同一对象再次点赞会取消点赞。给他人内容点赞会产生通知。

## Upload

```http
POST /api/upload/image
```

- 必须登录。
- 使用 `multipart/form-data`。
- 文件字段名：`file`。
- 允许 `jpg/jpeg/png/webp`。
- 单张最大 5MB。
- 图片按 ISO 周存储在 `/uploads/YYYY-Www/`。

返回示例：

```json
{
  "url": "/uploads/2026-W18/xxxx.jpg",
  "fullUrl": "http://bkeel.com:5300/uploads/2026-W18/xxxx.jpg"
}
```

## Report

- `POST /api/reports`

支持举报日记和评论。

## Notification

- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `POST /api/notifications/read-all`
- `POST /api/notifications/:notificationId/read`

通知可关联 `diaryId` 和 `commentId`，小程序点击通知后可进入对应日记并高亮相关评论/回复。

## Admin

- `GET /api/admin/classes/:classId/dashboard`
- `GET /api/admin/classes/:classId/join-requests`
- `POST /api/admin/join-requests/:requestId/handle`
- `GET /api/admin/classes/:classId/members`
- `POST /api/admin/classes/:classId/members/:userId/mute`
- `POST /api/admin/classes/:classId/members/:userId/role`
- `DELETE /api/admin/classes/:classId/members/:userId`
- `GET /api/admin/classes/:classId/reports`
- `POST /api/admin/reports/:reportId/handle`
- `POST /api/admin/diaries/:diaryId/hide`
- `POST /api/admin/comments/:commentId/hide`

管理员接口要求当前用户是对应班级管理员。
