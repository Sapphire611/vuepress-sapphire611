---
title: fastApi 相关
date: 2026-03-19
categories:
  - backend
tags:
  - python
sidebar: 'auto'
publish: true
---

## FastAPI 面试题目

以下是 FastAPI 开发中最基本和最常见的5道面试题目：

### FastAPI 相比 Flask 和 Django 有哪些优势？

**答案：**

FastAPI 的主要优势包括：

- **性能优越**：基于 Starlette 和 Pydantic，性能接近 NodeJS 和 Go，比 Flask 快很多
- **自动文档生成**：自动生成交互式 API 文档（Swagger UI 和 ReDoc）
- **类型提示**：充分利用 Python 3.6+ 的类型提示，提供更好的代码补全和类型检查
- **数据验证**：使用 Pydantic 自动验证请求数据，减少手写验证代码
- **异步支持**：原生支持异步编程，可以处理高并发场景
- **依赖注入**：强大的依赖注入系统，便于管理数据库连接、认证等
- **现代化**：基于最新的 Python 特性，代码简洁优雅

**代码示例：**
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    email: str

@app.post("/users/")
async def create_user(user: User):
    # 自动数据验证，无需手写验证逻辑
    return {"message": f"User {user.name} created"}
```

---

### 什么是异步编程？FastAPI 中如何使用 async/await？

**答案：**

**异步编程**是一种并发编程方式，允许程序在等待 I/O 操作时执行其他任务，提高性能和吞吐量。

**FastAPI 中的使用：**
- 路径操作函数可以声明为 `async def` 来使用异步
- 对于 CPU 密集型操作，仍然使用普通 `def`
- 数据库操作通常使用异步驱动（如 asyncpg、aiosqlite）

**代码示例：**
```python
from fastapi import FastAPI
import asyncio

app = FastAPI()

# 异步路径操作
@app.get("/")
async def read_root():
    # 可以在这里进行异步操作
    await asyncio.sleep(1)  # 模拟IO操作
    return {"message": "Hello World"}

# 普通路径操作（适用于CPU密集型任务）
@app.get("/cpu-intensive")
def cpu_intensive():
    result = sum(range(1000000))  # CPU密集计算
    return {"result": result}
```

**关键区别：**
- `async def`：适用于 I/O 密集型操作（数据库查询、API调用、文件操作）
- `def`：适用于 CPU 密集型操作，FastAPI 会在线程池中运行

---

### Pydantic 在 FastAPI 中扮演什么角色？如何进行数据验证？

**答案：**

**Pydantic** 是 FastAPI 数据验证的核心，负责：

- **请求数据验证**：自动验证 JSON 请求体、查询参数、表单数据
- **响应数据转换**：自动将 Python 对象转换为 JSON 响应
- **类型安全**：利用 Python 类型提示提供编译时和运行时检查
- **自动文档**：根据模型定义自动生成 API 文档

**数据验证特性：**
- 类型检查（int、str、bool 等）
- 复杂类型验证（List、Dict、嵌套模型）
- 字段约束（min_length、max_length、regex 等）
- 自定义验证器

**代码示例：**
```python
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr  # 自动验证邮箱格式
    age: int = Field(..., ge=18, le=120)  # 18-120岁
    password: str = Field(..., min_length=6)

    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('username must be alphanumeric')
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        # 从ORM模型映射
        from_attributes = True

# 在FastAPI中使用
@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate):
    # user已经过Pydantic验证
    # 自动转换数据类型
    # 自动生成API文档
    return user
```

---

### FastAPI 的依赖注入系统是如何工作的？

**答案：**

**依赖注入**是 FastAPI 的核心特性，提供了一种优雅的方式来管理共享逻辑和资源。

**主要功能：**
- 数据库连接管理
- 用户认证和授权
- 共享业务逻辑
- 参数验证和转换
- 资源清理

**依赖注入类型：**

1. **简单依赖**：函数作为依赖
2. **类依赖**：类作为依赖
3. **子依赖**：依赖可以有自己的依赖
4. **可选依赖**：使用 Optional
5. **yield 依赖**：支持资源清理

**代码示例：**
```python
from fastapi import FastAPI, Depends, HTTPException, Header
from typing import Optional

app = FastAPI()

# 1. 简单依赖
def get_user_agent(user_agent: str = Header(None)):
    return user_agent or "Unknown"

# 2. 类依赖
class DatabaseConnection:
    def __init__(self):
        self.connection = "DB_CONNECTION"

    def close(self):
        print("Closing connection")

# 3. yield依赖（自动资源清理）
async def get_db():
    db = DatabaseConnection()
    try:
        yield db  # 提供给路径操作
    finally:
        db.close()  # 请求结束后自动执行

# 4. 带验证的依赖
async def verify_token(token: str = Header(...)):
    if token != "secret-token":
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

# 5. 组合使用
@app.get("/items/")
async def read_items(
    db: DatabaseConnection = Depends(get_db),
    user_agent: str = Depends(get_user_agent),
    token: str = Depends(verify_token)
):
    return {
        "user_agent": user_agent,
        "token": token,
        "db": db.connection
    }
```

---

### 如何在 FastAPI 中处理异常和自定义中间件？

**答案：**

**异常处理**和**中间件**是 FastAPI 中处理横切关注点的重要机制。

### 异常处理

**HTTPException：** 用于返回 HTTP 错误响应
**自定义异常处理器：** 统一处理特定类型的异常

### 中间件

**中间件**在每个请求被特定路径操作处理之前处理请求，并在响应返回之前处理响应。

**应用场景：**
- CORS（跨域资源共享）
- 日志记录
- 性能监控
- 请求/响应修改
- 认证授权

**代码示例：**
```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

app = FastAPI()

# 1. CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 自定义中间件
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# 3. 自定义异常类
class ItemNotFoundException(Exception):
    def __init__(self, item_id: int):
        self.item_id = item_id

# 4. 异常处理器
@app.exception_handler(ItemNotFoundException)
async def item_not_found_handler(request: Request, exc: ItemNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"message": f"Item {exc.item_id} not found"}
    )

# 5. 全局异常处理器
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "path": request.url.path}
    )

# 6. 路径操作中使用异常
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id < 1:
        raise HTTPException(status_code=400, detail="Invalid item ID")

    if item_id > 100:
        raise ItemNotFoundException(item_id)

    return {"item_id": item_id, "name": f"Item {item_id}"}
```

---

### 额外提示：实际面试建议

**面试官可能会追问的问题：**

1. **性能优化**：如何处理高并发场景？
2. **安全性**：如何实现 JWT 认证和权限控制？
3. **测试**：如何编写单元测试和集成测试？
4. **部署**：如何使用 Docker 和 Gunicorn 部署 FastAPI 应用？
5. **数据库**：如何使用 SQLAlchemy 和 Alembic 进行数据库管理？

**最佳实践：**
- 熟悉 FastAPI 的官方文档
- 了解项目结构和模块化
- 掌握异步编程概念
- 理解依赖注入的设计模式
- 具备实际项目经验

这些面试题涵盖了 FastAPI 开发的核心概念，掌握这些内容将帮助你在面试中表现出色！