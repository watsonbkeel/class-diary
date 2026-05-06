# PROJECT_STRUCTURE

```text
class-diary-miniapp/
  README.md
  AGENTS.md
  docker-compose.yml
  docs/
  server/
  miniprogram/
```

## server

- `prisma/schema.prisma`：数据库模型
- `src/app.js`：应用装配
- `src/server.js`：服务入口
- `src/routes/*`：路由层
- `src/controllers/*`：控制器层
- `src/services/*`：业务层
- `src/middleware/*`：中间件
- `src/utils/*`：通用工具

## miniprogram

- `app.*`：全局入口
- `utils/`：配置、请求、鉴权、格式化
- `services/`：接口调用封装
- `pages/`：普通页面和管理页面
