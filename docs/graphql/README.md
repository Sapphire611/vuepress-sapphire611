---
title: 5分钟速通GraphQL
date: 2025-7-15
categories:
  - graphql
tags:
  - graphql
sidebar: 'auto'
publish: true
---

# 5 分钟速通 GraphQL

> GraphQL 是一种用于 API 的查询语言，也是一个服务器端运行时，用于执行查询。它允许客户端精确获取所需数据，避免过多或过少数据传输。

## 目录

- [5 分钟速通 GraphQL](#5-分钟速通-graphql)
  - [目录](#目录)
  - [GraphQL 简介](#graphql-简介)
  - [核心概念](#核心概念)
    - [Schema（模式）](#schema模式)
    - [示例：定义类型和基本操作(schema.ts)](#示例定义类型和基本操作schemats)
    - [Resolvers（解析器）](#resolvers解析器)
    - [示例：Mongoose 管理 Article 模型](#示例mongoose-管理-article-模型)
  - [常见面试题](#常见面试题)
  - [实践建议](#实践建议)
  - [参考资料](#参考资料)

---

## GraphQL 简介

GraphQL 是 Facebook 推出的 API 查询语言，旨在解决 REST API 的数据冗余和不足问题。它允许客户端按需获取数据，提升前后端协作效率。

- **特点**：
  - 单一 Endpoint
  - 精确查询
  - 强类型 Schema
  - 实时能力（Subscription）

---

## 核心概念

### Schema（模式）

Schema 定义了数据的类型、查询（Query）、变更（Mutation）等，是 GraphQL 服务的核心。

- **类型定义**：描述数据结构（如 Article、User 等）。
- **Query**：定义可查询的数据入口。
- **Mutation**：定义可修改数据的操作。

### 示例：定义类型和基本操作(schema.ts)

```ts
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Article {
    id: ID!
    title: String!
    content: String!
    category: Category
    createdAt: String
    updatedAt: String
  }

  type Category {
    id: ID!
    name: String!
  }

  type Query {
    articles: [Article]
    article(id: ID!): Article
    categories: [Category]
    category(id: ID!): Category
  }

  type Mutation {
    createArticle(title: String!, content: String!, categoryId: ID): Article
    updateArticle(id: ID!, title: String, content: String, categoryId: ID): Article
    deleteArticle(id: ID!): Boolean
    createCategory(name: String!): Category
    updateCategory(id: ID!, name: String!): Category
    deleteCategory(id: ID!): Boolean
  }
`;

export default typeDefs;
```

---

### Resolvers（解析器）

Resolvers 是实现 Schema 中每个字段的函数，决定如何获取和返回数据。

- **Query Resolver**：处理查询请求。
- **Mutation Resolver**：处理数据变更。

### 示例：Mongoose 管理 Article 模型

假设你用 Mongoose 管理 Article 和 Category 模型，Resolvers 可能如下：

```ts
// Article.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

// Category.ts
export default mongoose.model<IArticle>('Article', ArticleSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<ICategory>('Category', CategorySchema);
```

```ts
import Article from './models/Article';
import Category from './models/Category';

const resolvers = {
  Query: {
    articles: async () => Article.find().populate('category'),
    article: async (_: any, { id }: { id: string }) => Article.findById(id).populate('category'),
    categories: async () => Category.find(),
    category: async (_: any, { id }: { id: string }) => Category.findById(id),
  },
  Mutation: {
    createArticle: async (_: any, { title, content, categoryId }: any) => {
      const article = new Article({ title, content, category: categoryId });
      await article.save();
      return article;
    },
    updateArticle: async (_: any, { id, title, content, categoryId }: any) => {
      return Article.findByIdAndUpdate(id, { title, content, category: categoryId }, { new: true });
    },
    deleteArticle: async (_: any, { id }: { id: string }) => {
      await Article.findByIdAndDelete(id);
      return true;
    },
    createCategory: async (_: any, { name }: { name: string }) => {
      const category = new Category({ name });
      await category.save();
      return category;
    },
    updateCategory: async (_: any, { id, name }: any) => {
      return Category.findByIdAndUpdate(id, { name }, { new: true });
    },
    deleteCategory: async (_: any, { id }: { id: string }) => {
      await Category.findByIdAndDelete(id);
      return true;
    },
  },
  Article: {
    category: async (parent: any) => {
      return Category.findById(parent.category);
    },
  },
};

export default resolvers;
```

---

## 常见面试题

**1. GraphQL 和 REST 有什么区别？**

- GraphQL 允许客户端指定所需数据，避免 over-fetching/under-fetching。
- REST 每个资源一个 endpoint，数据结构固定。

**2. 什么是 Resolver？它的作用是什么？**

- Resolver 是用于处理 GraphQL 查询的函数，决定如何获取和返回数据。

**3. GraphQL 如何处理 N+1 查询问题？**

- 通过 DataLoader 等工具进行批量请求和缓存，减少数据库查询次数。

---

## 实践建议

- **Schema 设计要简洁明了**，避免过度嵌套。
- **Resolvers 要注意性能优化**，如使用 DataLoader 批量处理数据库请求。
- **错误处理要规范**，返回统一的错误格式。
- **善用工具链**：如 Apollo Server、GraphQL Playground、GraphiQL。

---

## 参考资料

- [GraphQL 官方文档](https://graphql.org/learn/)
- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [Mongoose 官方文档](https://mongoosejs.com/)
