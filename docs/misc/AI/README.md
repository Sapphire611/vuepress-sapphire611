---
title: AI Agent 相关
date: 2026-03-18
categories:
  - AI
tags:
  - AI
sidebar: 'auto'
publish: true
---

## AI Agent 相关

### 什么是 LangChain？

**LangChain** 是一个开源框架，用于开发由大型语言模型（LLM）驱动的应用程序。它提供了一套工具和抽象，帮助开发者轻松构建 LLM 应用，包括聊天机器人、智能代理、文档问答系统等。

#### 核心特点

- **模块化设计**：提供可组合的组件和接口
- **链式调用**：支持将多个组件串联形成复杂的处理流程
- **多 LLM 支持**：兼容 OpenAI、Anthropic、Hugging Face 等多种 LLM
- **数据集成**：内置与各种数据源的集成能力
- **记忆管理**：提供对话历史和上下文记忆功能

#### LangChain 核心组件

##### 1. Models（模型）
- **LLMs**：大语言模型，输入文本输出文本
- **Chat Models**：聊天模型，支持消息格式（系统、用户、助手消息）
- **Embeddings**：文本嵌入模型，用于向量化和语义搜索

```typescript
import { ChatOpenAI } from '@langchain/openai';

const chatModel = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7
});
```

##### 2. Prompts（提示词）
- **Prompt Templates**：提示词模板，支持变量插值
- **Few-shot Examples**：少样本示例
- **Output Parsers**：输出解析器，结构化 LLM 输出

```typescript
import { PromptTemplate } from '@langchain/core/prompts';

const prompt = PromptTemplate.fromTemplate(
  '请用{style}的风格回答以下问题：{question}'
);

const formattedPrompt = await prompt.format({
  style: '幽默',
  question: '什么是 LangChain？'
});
```

##### 3. Chains（链）
- **LLMChain**：基础链，结合提示词和模型
- **Sequential Chain**：顺序链，按顺序执行多个链
- **Router Chain**：路由链，根据输入动态选择执行路径

```typescript
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

const llm = new ChatOpenAI({ temperature: 0.9 });
const prompt = PromptTemplate.fromTemplate('讲一个关于{topic}的笑话');

const chain = new LLMChain({ llm, prompt });
const result = await chain.call({ topic: '程序员' });
```

##### 4. Agents（代理）
- **ReAct Agent**：推理+行动代理
- **OpenAI Functions Agent**：基于 OpenAI 函数调用的代理
- **Custom Agents**：自定义代理

**Agent 核心概念：**
- **Tools**：代理可使用的工具集合
- **Tool Executor**：工具执行器
- **Agent Executor**：代理执行器，管理代理运行循环

```typescript
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';

const tools = [new SerpAPI(), new Calculator()];
const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true
});

const result = await executor.call({
  input: '北京今天的温度加上25等于多少？'
});
```

##### 5. Memory（记忆）
- **Buffer Memory**：缓冲记忆，保存所有对话历史
- **Summary Memory**：摘要记忆，自动生成对话摘要
- **Conversation Buffer Window Memory**：窗口记忆，只保留最近的 K 轮对话
- **Vector Store Memory**：向量存储记忆，基于语义相似度检索历史

```typescript
import { BufferMemory } from 'langchain/memory';

const memory = new BufferMemory({
  memoryKey: 'chat_history',
  returnMessages: true
});

await memory.saveContext({
  input: '我叫张三'
}, {
  output: '你好张三，很高兴认识你！'
});

const history = await memory.loadMemoryVariables({});
```

##### 6. Retrievers（检索器）
- **Vector Store Retriever**：向量存储检索器
- **BM25 Retriever**：关键词检索器
- **Multi Query Retriever**：多查询检索器
- **Ensemble Retriever**：集成检索器

```typescript
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';

const vectorStore = await HNSWLib.fromTexts(
  ['LangChain 是一个 LLM 开发框架', 'React 是一个前端框架'],
  [],
  new OpenAIEmbeddings()
);

const retriever = vectorStore.asRetriever(2); // 返回最相关的2个结果
const results = await retriever.getRelevantDocuments('什么是 LangChain');
```

#### LangChain Expression Language (LCEL)

LCEL 是 LangChain 的新一代声明式链语言，提供：
- **流式处理**：支持流式输出
- **并行执行**：自动并行化独立步骤
- **类型检查**：完整的 TypeScript 支持
- **异步原生**：基于 async/await

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';

const model = new ChatOpenAI();

const prompt = PromptTemplate.fromTemplate(
  '将以下内容翻译成{language}：{text}'
);

const chain = RunnableSequence.from([
  prompt,
  model
]);

const result = await chain.invoke({
  language: '英语',
  text: '你好，世界'
});
```

#### 实际应用场景

##### 文档问答系统（RAG）
结合检索和生成，基于文档内容回答问题

```typescript
// 1. 加载文档
import { TextLoader } from 'langchain/document_loaders/fs/text';
const loader = new TextLoader('document.txt');
const documents = await loader.load();

// 2. 文本分块
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
});
const splits = await splitter.splitDocuments(documents);

// 3. 向量化存储
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  new OpenAIEmbeddings()
);

// 4. 创建检索链
import { RetrievalQAChain } from 'langchain/chains';
const chain = RetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever()
);

const answer = await chain.call({ query: '文档的主要内容是什么？' });
```

##### 聊天机器人
具有记忆功能的对话系统

```typescript
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

const chatChain = new ConversationChain({
  llm: model,
  memory: new BufferMemory()
});

const response1 = await chatChain.call({
  input: '我喜欢编程，特别是 Python'
});

const response2 = await chatChain.call({
  input: '我刚才说我喜欢什么？'
});
// Bot 会记得之前的对话内容
```

#### 面试常见问题

**Q1: LangChain 与直接调用 OpenAI API 有什么区别？**

LangChain 提供了更高层的抽象，支持链式调用、记忆管理、工具集成等复杂功能，而直接调用 API 需要手动管理上下文、提示词编排等细节。

**Q2: 如何优化 LangChain 应用的性能？**

- 使用流式处理减少首字延迟
- 使用缓存避免重复调用
- 批量处理嵌入操作
- 选择合适的向量存储和索引策略

**Q3: LangChain 的 Memory 组件有哪些类型？如何选择？**

- **Buffer Memory**：适用于短对话，完整保存历史
- **Summary Memory**：适用于长对话，压缩历史为摘要
- **Window Memory**：适用于需要限制上下文长度的场景
- **Vector Store Memory**：适用于需要语义检索历史的场景

**Q4: 如何处理 LangChain 中的错误和重试？**

LangChain 内置了重试机制，可以配置：

```typescript
const chain = new LLMChain({
  llm: model,
  prompt,
  timeout: 30000,
  maxRetries: 3
});
```

**Q5: LCEL 与传统 Chains 的区别？**

LCEL 提供更灵活的组合方式、更好的类型安全、原生支持流式处理，是 LangChain 推荐的新一代开发范式。



### 大模型如何拥有记忆（如何记住之前的信息）

- 实际上 AI 并没有记忆，只是每次聊天时，都把历史对话记录一起发出去而已，前端需要维护上下文。

#### 短期记忆层：通过 `Store` 维护，保证当前对话上下文一致

#### 中期记忆层: `localStorage` 中存储最近几轮的对话文章记录

- 滑动窗口策略: 只保留最新的 N 条信息，更早的丢弃
- 增量摘要：当对话超过 N 次，将最早的一部分信息，使用模型生成摘要，并存储。后续请求时，使用 `摘要+最近N条完整信息` 作为上下文

```js
[系统提示词 + 项目级记忆(比如 CLAUDE.md)] + [会话摘要: summary_1] + [最近N条完整消息] + [当前用户问题]
```

#### 长期记忆层：服务端存储

- 存储绘画内容：后端为每个 `session` 生成唯一 id，并作为存储和检索的钥匙

- 按需加载：前端初始化时，像后端请求最近的 N 条会话信息作为参考

- 冷热分离：活跃的会话保存在 `Redis` 中，不活跃的保存在普通数据库中

### CLAUDE.md 是什么？实现原理?

`CLAUDE.md` 是 Anthropic 为 Claude Code（Claude 的命令行工具）设计的一种持久化记忆文件，Claude 每次启动时自动读取这个文件，从而"记住"你项目的各种规范、命令和注意事项

```markdown
# CLAUDE.md - 我的项目记忆文件

## 项目概述

这是一个 Next.js 电商应用，使用 Stripe 支付和 Prisma ORM

## 代码规范

- 使用 TypeScript 严格模式，禁止使用 `any`
- 使用命名导出，不使用默认导出
- 组件命名使用 PascalCase，自定义 Hook 使用 use 前缀

## 常用命令

- `npm run dev`: 启动开发服务器
- `npm test`: 运行测试
- `npm run lint`: 代码检查
```

#### 实现原理

CLAUDE.md 的实现基于一个分层记忆系统，类似你之前了解的前端存储分层设计

| 记忆层级       | 文件位置                       | 作用范围     | 类比                     |
| -------------- | ------------------------------ | ------------ | ------------------------ |
| **用户级记忆** | `~/.claude/CLAUDE.md`          | 所有项目     | 你的个人习惯（随身携带） |
| **项目级记忆** | `./CLAUDE.md`（项目根目录）    | 当前项目     | 团队规范（家规）         |
| **模块化规则** | `.claude/rules/*.md`           | 特定文件类型 | 专项说明书               |
| **自动记忆**   | `.claude/projects/*/MEMORY.md` | 项目+用户    | 经验积累本               |

#### 实现 demo

```js
// 简化版的实现原理
// 当多个层级的记忆文件存在时，遵循就近原则：项目级覆盖用户级，模块化规则按需激活
// 你之前的伪代码
[系统提示词 + 项目级记忆(比如 Claude.md)] + [会话摘要] + [最近消息] + [当前问题]

// 实际实现
// 前端实现示例
class AIChatWithMemory {
    constructor(projectId) {
        this.projectId = projectId;
        this.projectMemory = null;
        this.loadProjectMemory();
    }

    // 加载项目级记忆（相当于 CLAUDE.md）
    async loadProjectMemory() {
        // 可以从后端 API 获取项目的"记忆配置"
        const response = await fetch(`/api/projects/${this.projectId}/memory`);
        this.projectMemory = await response.json();
        // 格式示例：
        // {
        //   "description": "电商项目，使用 React + Node.js",
        //   "codeStyle": "使用 TypeScript，命名导出",
        //   "apiDocs": "RESTful 风格，使用 /api/v1 前缀"
        // }
    }

    // 构建发送给 AI 的消息
    async sendMessage(userMessage, sessionContext) {
        // 将项目记忆作为系统提示词的一部分
        const messages = [
            {
                role: 'system',
                content: this.formatProjectMemory()  // 注入项目级记忆
            },
            ...sessionContext.summary,  // 会话摘要
            ...sessionContext.recent,   // 最近 N 条消息
            { role: 'user', content: userMessage }
        ];

        return this.callAIAPI(messages);
    }

    formatProjectMemory() {
        return `
            项目信息：${this.projectMemory.description}
            代码规范：${this.projectMemory.codeStyle}
            API 规范：${this.projectMemory.apiDocs}

            请在这些规范指导下回答用户问题。
        `;
    }
}
```

### 什么是 RAG

**RAG (Retrieval-Augmented Generation)** 是一种结合上下文检索和生成的 AI 技术，用于增强大语言模型的准确性和可靠性。

#### 核心概念

RAG 通过以下步骤工作：

1. **文档处理**：将知识库文档切分成小块（chunks）
2. **向量化**：使用 embedding 模型将文本块转换为向量
3. **存储**：将向量存储在向量数据库中（如 Pinecone、Weaviate、Milvus）
4. **检索**：用户提问时，将问题向量化，从数据库中检索最相关的文本块
5. **增强**：将检索到的相关内容作为上下文注入到提示词中
6. **生成**：LLM 基于增强的上下文生成回答

#### 优势

- **减少幻觉**：基于真实数据生成答案
- **知识更新**：无需重新训练模型即可更新知识
- **可追溯性**：可以引用信息来源
- **成本效益**：相比微调模型成本更低

#### 应用场景

- 企业知识库问答
- 客服智能助手
- 技术文档查询
- 个人笔记搜索

#### 面试要点

```bash
# RAG vs Fine-tuning 对比
RAG:
- 适合需要访问最新信息的场景
- 实现简单，快速部署
- 可以引用数据源

Fine-tuning:
- 适合学习特定风格或格式
- 需要大量训练数据
- 训练成本高，更新困难
```

#### 常用技术栈

- **Embedding 模型**：OpenAI text-embedding-3、BGE、M3E
- **向量数据库**：ChromaDB、FAISS、Qdrant
- **框架**：LangChain、LlamaIndex

---

### 什么是 MCP

**MCP (Model Context Protocol)** 是一个开放协议，用于连接 AI 助手与外部数据源和工具。

#### 核心概念

MCP 定义了标准化的方式让 AI 模型：

1. **连接数据源**：访问本地文件、数据库、API 等
2. **执行工具**：运行脚本、调用函数
3. **上下文共享**：在不同会话间共享状态

#### 架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│  Resources  │
│ (AI 助手)   │     │ (MCP 服务)  │     │ (数据/工具)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

#### 优势

- **标准化**：统一的接口协议
- **安全性**：明确的权限控制
- **可扩展**：轻松添加新的数据源
- **跨平台**：支持多种 AI 应用

#### 应用示例

- 读取本地代码仓库
- 执行数据库查询
- 调用外部 API
- 文件系统操作

#### 面试要点

MCP 解决了 AI 应用的关键问题：

- 如何让 AI 访问实时数据
- 如何安全地执行操作
- 如何扩展 AI 能力

---

### 常见 AI 面试题汇总

#### 1. LLM 基础

**Q: 什么是 Transformer 架构？**

- 自注意力机制（Self-Attention）
- 编码器-解码器结构
- 并行计算能力
- 位置编码

**Q: 解释 Temperature 参数**

- 控制输出的随机性
- 低温度（0.1-0.3）：更确定、聚焦
- 高温度（0.7-1.0）：更有创意、多样化

**Q: 什么是 Token？**

- LLM 处理文本的基本单位
- 1 token ≈ 0.75 个英文单词或 2-3 个汉字
- 影响计费和上下文窗口

#### 2. AI 应用开发

**Q: 如何处理 LLM 的上下文限制？**

- 滑动窗口：保留最近的对话
- 总结压缩：将旧对话总结后保留
- 向量检索：只检索相关信息（RAG）
- 分段处理：将任务分解为多个小任务

**Q: 如何评估 AI 应用的质量？**

- 准确性：答案是否正确
- 相关性：是否回答了问题
- 完整性：信息是否充分
- 用户体验：响应速度、交互流畅度
- 成本：Token 消耗、API 调用次数

---

### 实战技巧

#### 向量数据库选择

| 数据库   | 特点             | 适用场景             |
| -------- | ---------------- | -------------------- |
| ChromaDB | 轻量、易用       | 原型开发、小规模应用 |
| Pinecone | 托管服务、高性能 | 生产环境、大规模应用 |
| FAISS    | 开源、高效       | 本地部署、成本敏感   |
| Qdrant   | 过滤支持好       | 需要复杂过滤查询     |

#### 成本优化

1. **使用更小的模型**：简单任务用小模型
2. **缓存机制**：相同问题直接返回缓存
3. **Prompt 压缩**：去除冗余信息
4. **批量处理**：合并多个请求

---

### 参考资源

- [LangChain 文档](https://python.langchain.com/)
- [LlamaIndex 指南](https://docs.llamaindex.ai/)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)
- [RAG 论文](https://arxiv.org/abs/2005.11401)
