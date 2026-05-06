# DATABASE_SCHEMA

本项目使用 `Prisma + MySQL 8.0`。

## 枚举

- `ClassRole`: `member` / `admin`
- `JoinRequestStatus`: `pending` / `approved` / `rejected`
- `ContentStatus`: `visible` / `hidden` / `deleted`
- `LikeTargetType`: `diary` / `comment`
- `ReportTargetType`: `diary` / `comment`
- `ReportStatus`: `pending` / `resolved` / `rejected`
- `NotificationType`: `diary_liked` / `comment_liked` / `diary_commented` / `comment_replied` / `report_handled` / `join_request_approved` / `join_request_rejected`
- `ModerationTargetType`: `join_request` / `diary` / `comment` / `member` / `report`
- `ModerationAction`: `approve_join_request` / `reject_join_request` / `hide_diary` / `hide_comment` / `mute_member` / `unmute_member` / `remove_member` / `set_admin` / `unset_admin` / `resolve_report` / `reject_report`

## 模型

- `User`
- `Class`
- `ClassMember`
- `JoinRequest`
- `Diary`
- `DiaryImage`
- `Comment`
- `Like`
- `Report`
- `Notification`
- `ModerationLog`

## 设计约束

- 匿名内容保存真实 `authorId`
- 普通接口不返回匿名真实作者
- 管理接口可以返回匿名真实作者
- `Diary` / `Comment` 使用 `status` 做软删除和隐藏
- `Like` / `Report` / `ModerationLog` 用 `targetType + targetId` 表示多态目标
- 所有班级内容通过 `classId` 强隔离
