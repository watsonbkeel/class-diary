# 班级日记本小程序开发 Prompt 记录

> 记录范围：根据本次可见会话、系统续跑提示、开发过程摘要和代理任务记录整理。时间按会话发生顺序排列，重点保留对项目实现产生影响的 Prompt / 指令。

## 1. 初始完整项目生成 Prompt

### P001：一次性生成完整项目代码

用户要求读取当前项目根目录所有需求文档，包括：

- `README.md`
- `AGENTS.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/API_SPEC.md`
- `docs/UX_FLOW.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/TEST_PLAN.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/PERMISSION_MODEL.md`

核心要求：

- 项目名称：班级日记本小程序。
- 目标：面向班级内部使用，学生可以发布日记、匿名发布、评论、回复、匿名评论、点赞、通知和举报。
- 管理员可以审核入班申请、管理成员、处理举报、隐藏违规内容、禁言成员，并在管理界面追溯匿名内容真实作者。
- 不再询问需求；文档未明确的细节选择最简单、最稳定、最适合第一版的实现。
- 优先保证项目可运行、接口闭环、权限正确，而不是 UI 精美。

技术栈要求：

- 前端：微信小程序原生开发、JavaScript、WXML、WXSS。
- 禁止：Taro、UniApp、React、Vue。
- 后端：Node.js、Express、Prisma、MySQL 8.0、JWT、Multer、axios、Docker Compose。
- 禁止：NestJS、MongoDB、SQLite、PostgreSQL。

数据库/运行要求：

- Docker Compose 启动 MySQL 8.0。
- Prisma datasource 使用 `provider = "mysql"`。
- 数据库名：`class_diary`。
- 数据库用户：`class_diary_user`。
- 后端本地运行在宿主机，连接 `127.0.0.1:3306` 的 Docker MySQL。

项目结构要求：

- 生成 `class-diary-miniapp/`。
- 包含 `README.md`、`AGENTS.md`、`docker-compose.yml`。
- 包含 `docs/` 需求文档。
- 包含 `server/`，分层为 config、middleware、routes、controllers、services、utils、prisma、uploads。
- 包含 `miniprogram/`，分为 utils、services、pages，页面包括登录、班级选择、加入班级、日记列表、发布日记、日记详情、通知、我的、管理员首页、入班申请、成员管理、举报处理。

后端能力要求：

- Express 基础服务、CORS、JSON body parser、静态资源 `/uploads`、全局错误处理、统一响应格式。
- JWT 登录鉴权。
- 微信登录 `code2session`。
- 开发环境 mock 登录兼容。
- `WECHAT_APPID` 或 `WECHAT_SECRET` 为空/占位时，允许用 code 生成 mock openid。
- 第一个注册用户自动 `isGlobalAdmin = true`。

数据库模型和枚举要求：

- 模型：User、Class、ClassMember、JoinRequest、Diary、DiaryImage、Comment、Like、Report、Notification、ModerationLog。
- 枚举：ClassRole、JoinRequestStatus、ContentStatus、LikeTargetType、ReportTargetType、ReportStatus、NotificationType、ModerationTargetType、ModerationAction。

API 要求：

- Auth：`POST /api/auth/wechat-login`、`GET /api/auth/me`。
- Class：创建班级、我的班级、邀请码查询、提交入班申请。
- Diary：列表、创建、详情、删除。
- Comment：列表、创建、删除。
- Like：日记点赞、评论点赞。
- Upload：`POST /api/upload/image`。
- Report：创建举报。
- Notification：列表、未读数、单条已读、全部已读。
- Admin：管理首页、入班申请、成员、禁言、角色、移除、举报处理、隐藏日记、隐藏评论。

业务规则要求：

- 班级、成员、日记、评论、点赞、通知、举报、管理操作全部需要权限校验。
- 匿名内容数据库保存真实作者，普通成员不能看到真实作者，管理员可以追溯。
- 删除/隐藏只做软删除。
- 禁言用户不能发日记、评论、回复。
- 点赞/评论/回复/审核/举报处理产生通知。
- 管理操作写入 ModerationLog。

小程序要求：

- `app.json` 注册所有页面。
- `utils/config.js` 配置 `PUBLIC_BASE_URL` 和 `API_BASE_URL`。
- `utils/request.js` 统一封装请求，自动带 Bearer token，401 清理登录并跳转登录页。
- services 目录封装 API 调用。
- 上传图片使用 `wx.uploadFile`。
- 页面具备基础加载态、空状态、错误提示。

验收要求：

- Docker Compose 可启动 MySQL。
- Prisma schema 可迁移。
- 后端路由全部挂载。
- 小程序页面全部注册。
- 匿名/管理员/班级成员/禁言/软删除/上传/通知/统一返回格式等关键规则自检通过。

结果：生成完整项目，并经过多轮 Oracle 审查修复初始 blocker。

---

## 2. 启动与部署联调 Prompt

### P002：写入 AppID 并启动项目

用户 Prompt：

> 我已经获取到wx的appid:wxf3695294222ee30e,现在启动整个班级小程序

处理结果：

- 写入 AppID：`wxf3695294222ee30e`。
- 创建 `.env`。
- 安装依赖。
- Prisma 从 v7 回退到 v6 稳定版本。
- 启动 Docker MySQL。
- 修复 shadow database 权限。
- 执行迁移。
- 启动后端并验证 `/health`。

### P003：Debian 服务器 + Mac 微信开发者工具发布方式

用户 Prompt：

> 目前开发和部署环境是一个debian的服务器,但是这里没有安装微信开发者工具,我需要在远程另外一个mac打开微信开发者工具,然后我要怎么操作才能发布?

处理结果：

- 明确 Debian 跑后端和 MySQL，Mac 用微信开发者工具打开/预览/上传。
- 说明 `127.0.0.1` 对 Mac 和真机不可用。
- 建议正式发布使用 HTTPS 域名。
- 给出 `rsync` 同步方式。

### P004：微信教育小程序简单上线说明

用户 Prompt：

> 我是要发布在微信教育小程序,https://edu.weixin.qq.com/,这里不需要认证,有个简单上线,不能传播,只能扫描体验.

处理结果：

- 查阅教育小程序文档。
- 确认教育体验版/简单上线不是正式公开发布。
- 强调扫码体验仍不能访问 `127.0.0.1`。
- 给出教育体验版上传和扫码流程。

---

## 3. 登录与 frp 问题 Prompt

### P005：微信登录失败，询问 AppSecret

用户 Prompt：

> 我现在把代码上传了,通过本机通过frp把3000端口开放给公网访问.我在微信开发工具体验,第一步微信登录就失败了.我需要先解决这个问题,appsecret没找到哪里有?

处理结果：

- 验证本机后端登录接口成功。
- 判断失败更可能是小程序仍访问 `127.0.0.1`。
- 说明当前没有真实 AppSecret 时后端会走 mock 登录，不阻塞调试。

### P006：frp health 可访问但登录失败

用户 Prompt：

> 我已经配置好http://bkeel.com:5300/health ,你可以检查.但是我在微信开发工具看,这个微信登录还是失败,是否需要配置的信息要调整一下.因为我用frpc转发的

处理结果：

- 验证 `http://bkeel.com:5300/health` 成功。
- 验证公网登录接口成功。
- 将小程序 `PUBLIC_BASE_URL`、`API_BASE_URL` 改为 `http://bkeel.com:5300`。
- 将后端 `PUBLIC_BASE_URL` 同步为 frp 地址并重启。

### P007：UNAUTHORIZED 响应

用户 Prompt：

> {"success":false,"error":{"code":"UNAUTHORIZED","message":"未登录或 token 无效"}}

处理结果：

- 判断这是受保护接口未带 token 的正常失败，不是登录接口失败。
- 修复登录页旧 token 自动跳转逻辑：进入登录页时先调用 `/auth/me` 校验 token，无效则清理 session。

---

## 4. 班级创建权限 Prompt

### P008：无班级时新用户没有创建入口

用户 Prompt：

> 我用一个新账号登录进来,要我选择加入班级,但是现在应该是一个班级都没,又没创建班级入口,这个设计有问题.需要增加一个创建班级功能

处理结果：

- 班级选择页无班级时显示创建班级表单。
- 首个班级可由当前用户创建，创建者自动成为该班级管理员。

### P009：要求取消全局管理员创建限制

用户 Prompt：

> 目前创建班级不成功,提示要全局管理员才可以创建,需要把权限下放,谁都可以创建班级,第一个创建班级的人就是管理员,其他人就是普通班级成员.暂时不用超级管理员,超级管理员要改某个班级管理员,我直接用代码修改就好

处理结果：

- 后端移除 `isGlobalAdmin` 创建班级限制。
- 任何登录用户都可以创建班级。
- 创建者自动成为该班级 admin。
- 加入班级经审核后仍为普通 member。
- 文档同步新规则。
- 验证非全局管理员在已有班级后仍可创建新班级。

---

## 5. 阶段总结 Prompt

### P010：询问目前做了什么

用户 Prompt：

> What did we do so far?

处理结果：

- 输出项目生成、部署、frp、登录、班级创建等已完成事项。
- 列出当前待验证事项。

### P011：继续未完成任务

系统/用户 Prompt：

> Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.

处理结果：

- 继续完成创建班级权限下放验证。
- 重启后端。
- 验证公网 API。

---

## 6. UX、昵称、图片、帮助 Prompt

### P012：四个体验问题

用户 Prompt：

> 还有几个问题,我逐个说:1.所有的输入框,比如班级名称\班级描述\输入邀请码,都很窄,我自己输入的文字都看不到,这个要优化解决;2.我用微信登录,结果就显示"微信用户",没有地方可以给我修改我的昵称,或者说让我在不同班级,可以用不同的昵称.3.我在一个"66班"有个帖子有图片的,但是我自己可以看到,其他用户就看不到. 4.因为新用户进来需要一些帮助,所以你还需要在首页,加入一些帮助文档,让新用户知道怎么玩这个班级日记

处理结果：

- 优化全局 `.input`、`.textarea` 样式：宽度、边框、字号、高度、行高。
- 新增全局昵称编辑：`PATCH /api/auth/me`。
- 新增本班昵称：`ClassMember.classNickname`、迁移、`PATCH /api/classes/:classId/nickname`。
- 日记/评论展示优先使用本班昵称。
- 后端图片返回 `fullUrl`。
- 前端优先使用后端 `fullUrl`。
- 登录页和班级选择页加入新手指引。

### P013：图片仍不可见，怀疑上传鉴权

用户 Prompt：

> we can not see the photos utill now, maybe we need to reset the auth for the upload photos

处理结果：

- 验证 `/uploads/...` 图片公网 200。
- 验证 `66班` 另一个成员 API 能拿到图片 URL。
- 判断不是上传鉴权问题。
- 新增小程序图片缓存兜底：用 `wx.request` 拉取图片二进制，写入本地文件，再用本地路径渲染。

### P014：要求给一个用户上传图片链接

用户 Prompt：

> 你发一个用户上传的图片的链接给我,我要自己用浏览器打开试试

处理结果：

- 提供示例链接：
  - `http://bkeel.com:5300/uploads/1777367768546-saw3wimu.jpg`
  - `http://bkeel.com:5300/uploads/1777367768704-f9ljzzzc.jpg`
  - `http://bkeel.com:5300/uploads/1777367768794-mfjcn9ck.jpg`
  - `http://bkeel.com:5300/uploads/1777361747899-8iebqk0q.png`

### P015：调整新手指引位置

用户 Prompt：

> 新手指引的位置需要再调整一下,放在我已经加入的班级列表后面,创建班级的前面.这样新用户可以一眼看到,老用户也可以不给这个给遮挡视线

处理结果：

- 将 `新手指引` 从顶部移动到“我的班级列表/空状态”之后、“创建班级”之前。

---

## 7. Bee 上传故障 Prompt

### P016：Bee 上传图片一直转圈

用户 Prompt：

> 现在有客户反馈,发送图片,一直在转圈,然后就回到原始状态了,查一下这个问题.是六6班的成员Bee反馈的

处理结果：

- 定位 Bee 用户：userId 16，`六6班` member，未禁言。
- 用 Bee token 验证服务端上传成功。
- 修复移动端上传体验：
  - `wx.chooseMedia` 使用压缩图。
  - `wx.compressImage` 二次压缩。
  - 上传超时设为 120 秒。
  - 上传失败重试一次。
  - 显示“正在处理第 x/y 张”“正在上传第 x/y 张”。
  - 失败时保留错误提示，不再静默恢复。
  - Multer `LIMIT_FILE_SIZE` 返回明确 JSON：`图片不能超过 5MB，请压缩后再上传`。
  - HEIC/HEIF 提前拦截并提示。
  - 压缩后仍超过 5MB 则阻止上传。
  - 上传过程中禁用选择、移除、提交按钮，避免重复提交或状态竞争。
- 验证 Bee 上传 → 发日记 → 另一个成员可见图片。

---

## 8. 图片交互 Prompt

### P017：图片点击放大全屏查看

用户 Prompt：

> 图片是可以看到了,但是在小程序点击看别人发的日记的图片,没法放大,把图片变成全屏查看

处理结果：

- 日记列表图片点击调用 `wx.previewImage`。
- 日记详情图片点击调用 `wx.previewImage`。
- 发布页本地预览图片也支持点击全屏查看。
- 多图支持左右滑动。

---

## 9. 上传目录 Prompt

### P018：uploads 下按周分目录

用户 Prompt：

> 还有一个上传图片路径的问题,目前我看图片是上传到uploads一个目录下,这里需要在uploads下再分文件夹存上传的图片,因为这个用户很少,所以不需要按天做文件夹,可以考虑按周来做文件夹名,比如定义某个时间段,大概就是7天,用户上传的图片都放这里

处理结果：

- 上传目录改为 ISO 周目录：`server/uploads/YYYY-Www/`。
- 示例：`/uploads/2026-W18/xxxx.jpg`。
- 老图片仍保留在原 `uploads/` 根目录，继续可访问。
- 验证 Bee token 上传返回周目录路径，公网访问 200。

---

## 10. 通知跳转 Prompt

### P019：通知点击进入对应日记

用户 Prompt：

> 还有一个细节需要优化,从通知看到有人对你的日记点赞或者评论,需要增加一个操作,点击这个通知可以进入到对应的日记,查看谁点赞或者评论,立即就可以互动起来.进入到日记后的返回,则还是回到原来的通知界面,可以继续查看更多通知

处理结果：

- 通知卡片可点击。
- 未读通知点击时先标记已读。
- 有 `diaryId` 的通知使用 `wx.navigateTo` 进入日记详情，返回键回到通知页。
- 有 `commentId` 的通知传入 `commentId` 并高亮相关评论/回复。
- 日记详情顶部显示来源提示，例如：`Bee 评论了这篇日记`、`Watson 点赞了这篇日记`。
- 通知卡片显示来自谁、班级、时间和“点击查看日记”。

---

## 11. 文档生成 Prompt

### P020：生成开发历史与开发纪要文档

用户 Prompt：

> 目前这个小程序已经开发基本完成,请你生成以下2个文档,第一个文档是这个小程序开发的全部Prompt记录,名字用class-diary-history.md.第二个文档是总结整个开发过程的纪要,包括哪里复杂度比较高容易出错,哪里的功能要重复多次修改,输出一个开发纪要.md的文档.

处理结果：

- 生成本文档：`class-diary-history.md`。
- 生成开发纪要：`开发纪要.md`。

---

## 12. 重要代理/审查 Prompt 摘要

开发过程中多次使用后台代理和 Oracle 审查，关键任务包括：

- Explore requirements：梳理需求文档和项目结构。
- Research Express Prisma：查询 Express + Prisma + MySQL 常见实现方式。
- Research miniapp patterns：查询微信小程序原生页面、request、uploadFile 模式。
- Generate complete project：生成完整项目代码。
- Review generated project：Oracle 审查初始项目，发现 join request、匿名通知、匿名评论 UI、评论计数等 blocker。
- Re-review blocker fixes：Oracle 复审 blocker 修复。
- Research edu launch：查询微信教育小程序简单上线流程。
- Inspect login config：检查登录和 frp 配置。
- Find class creation flow：定位班级创建链路。
- Find form styles / nickname flow / diary images / home flow：定位 UX、昵称、图片和帮助文档问题。
- Review UX fixes：Oracle 审查昵称、图片、输入框、新手指引等改动。
- Review image cache：Oracle 审查图片本地缓存渲染方案。
- Trace upload flow / Check upload docs：排查 Bee 上传长时间转圈问题。
- Review Bee upload fix：Oracle 审查 Bee 上传修复，指出上传期间控件仍可交互的 race condition。
- Trace notifications：梳理通知数据流和跳转日记详情方案。

---

## 13. 自动续跑/系统提示记录

开发期间出现多次系统续跑提示，典型内容为：

- TODO 未完成，继续下一个 pending task。
- 不要询问权限，继续执行。
- 如果认为完成，需要重新审查剩余 todo。
- 后台任务完成，使用 `background_output(task_id=...)` 收集结果。

这些提示推动了以下收尾工作：

- 创建班级权限变更后的运行时验证。
- Oracle 结果收集后再最终答复。
- 上传图片修复后的 Bee 完整链路验证。
- 通知跳转功能的语法和数据流验证。
