---
title: ElasticSearch Demo
date: 2025-7-14
categories:
  - elasticSearch
sidebar: 'auto'
publish: true
---

## ElasticSearch Demo

::: right

[Elasticsearch 翻译说明](https://elasticsearch.bookhub.tech/)

来自 [Sapphire611](http://sapphire611.github.io)

:::

Elasticsearch 是一种分布式文档存储。Elasticsearch 不用列数据行存储信息，而是存储已序列化为 JSON 文档的复杂数据结构。当集群中有多个 Elasticsearch 节点时，存储的文档将分布在集群中，且可以从任何节点直接访问。

Elasticsearch 使用一种称之为倒排索引的数据结构，支持非常快的全文搜索。倒排索引列出任何文档中出现的唯一单词，并标识每个单词出现的所有文档。

默认情况下，Elasticsearch 索引每个字段中的所有数据，且每个被索引的字段有一个专用的优化数据结构。例如，文本字段被存储在倒排索引中，数字和地理字段存储在 BKD 树 中。使用每个字段的数据结构来聚集和返回搜索结果是让 Elasticsearch 如此快的原因。

## 1. 使用 docker 拉取 elasticSearch

```bash
docker network create elastic

docker pull docker.elastic.co/elasticsearch/elasticsearch:8.17.0
docker pull docker.elastic.co/kibana/kibana:8.17.0

docker run --name es01 -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node"  -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.17.0

docker run --name kib01 -p 5601:5601 -e "ELASTICSEARCH_HOSTS=http://host.docker.internal:9200" docker.elastic.co/kibana/kibana:8.17.0
```

## 2. 通过 RESTFUL API 创建索引

### 2.1 测试连通性

```bash
GET http://localhost:9200

{
    "name": "667064611b41",
    "cluster_name": "docker-cluster",
    "cluster_uuid": "9EKuEBKaTmaLu5l93Ok1Uw",
    "version": {
        "number": "7.11.2",
        "build_flavor": "default",
        "build_type": "docker",
        "build_hash": "3e5a16cfec50876d20ea77b075070932c6464c7d",
        "build_date": "2021-03-06T05:54:38.141101Z",
        "build_snapshot": false,
        "lucene_version": "8.7.0",
        "minimum_wire_compatibility_version": "6.8.0",
        "minimum_index_compatibility_version": "6.0.0-beta1"
    },
    "tagline": "You Know, for Search"
}
```

```json
PUT http://localhost:9200/customer/_doc/1
{
  "name": "John Doe"
}

// 由于这是一个新的文档，这个响应表明这个操作的结果为版本1的文档被创建：
// 重复操作会导致更新 _version 字段增加
{
    "_index": "customer",
    "_type": "_doc",
    "_id": "1",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```

```bash
GET http://localhost:9200/_cat/indices"

yellow open bank     -znPWZZRRjuxCjmFCKIvqg 1 1 1000 0 379.2kb 379.2kb
yellow open user     ITzFEZamSsuOjbphlCBs6A 1 1    1 3  22.4kb  22.4kb
yellow open customer FXdzSEiTSFyYR6EJ3KkmAA 1 1    1 0   3.8kb   3.8kb
```

> Bank query demo

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "age": "40" } }
      ],
      "must_not": [
        { "match": { "state": "ID" } }
      ]
    }
  }
}

---

{
    "took": 16,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 43,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "bank",
                "_type": "_doc",
                "_id": "474",
                "_score": 1.0,
                "_source": {
                    "account_number": 474,
                    "balance": 35896,
                    "firstname": "Obrien",
                    "lastname": "Walton",
                    "age": 40,
                    "gender": "F",
                    "address": "192 Ide Court",
                    "employer": "Suremax",
                    "email": "obrienwalton@suremax.com",
                    "city": "Crucible",
                    "state": "UT"
                }
            },
        ]
    }
}

```

[更多 demo 搜索可以查看文档，很详细](https://elasticsearch.bookhub.tech/getting_started/esindex)

---

### 3. 聚合搜索

```json
GET /bank/_search
{
  "size": 0, // 表示不返回原始文档，仅返回聚合结果（减少响应体积）
  "aggs": {
    "group_by_state": {          // 聚合结果名称
      "terms": {                 // 使用 terms 桶聚合（bucket aggregation）
        "field": "state.keyword" // 对 state.keyword 字段进行分组统计，生成分组桶（buckets），每个桶代表一个州（如 CA/TX/NY）
      }
    }
  }
}
```

可以使用嵌套聚合结果进行排序（通过指定词语聚合顺序），而不是按计数结果进行排序：

```json
GET /bank/_search
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword",
        "order": {
          "average_balance": "desc"
        }
      },
      "aggs": {
        "average_balance": {
          "avg": {
            "field": "balance"
          }
        }
      }
    }
  }
}
```

#### 字段名称是 state，为什么要加上.keyword ?

```json
"reason": "Text fields are not optimised for operations that require per-document field data like aggregations and sorting..."
```

::: warning

⚠️ 类型冲突

state 字段被映射为 text 类型（用于全文搜索）

text 类型默认禁用聚合/排序操作，因为：

全文搜索字段会被分词（如 "New York" → ["new", "york"]）
无法直接获取完整原始值进行分组统计
:::

### Kibana

> 是一个开源的日志分析平台,正确配置后，点击左边 Discover 菜单，就可以看到数据并查询了

```kql
age: 40
state.keyword: "UT"
balance > 30000
age: 40 AND NOT state.keyword: "ID"
```

[Kibana 中的 KQL 语法使用](https://www.cnblogs.com/liyuanhong/articles/18308379)

---

### Elasticsearch 的倒排索引（Inverted Index）是什么？与传统数据库索引有何区别？

- 倒排索引是通过分词（Analysis）将文档内容拆分为词项（Terms），建立 词项 → 文档 ID 的映射，而非传统数据库的 文档 ID → 内容。

- 优势：适合全文搜索，能快速定位包含关键词的文档（如搜索引擎）。

- 对比：传统索引（如 B 树）适合精确查询，但模糊搜索效率低。

### BKD 树 vs KD 树 对比

- KD 树 是一种 二叉搜索树（BST）的扩展，用于高效组织和查询 K 维空间中的数据点（如 2D 地理坐标、3D 模型数据、多维特征向量等）。它通过递归划分空间，加速 范围搜索 和 最近邻搜索（KNN）。

| **对比维度**      | **KD 树 (K-Dimensional Tree)**             | **BKD 树 (Block K-Dimensional Tree)**             |
| ----------------- | ------------------------------------------ | ------------------------------------------------- |
| **设计目的**      | 内存中的多维数据快速检索                   | 磁盘友好的高维数据存储与检索                      |
| **数据结构**      | 二叉搜索树，按维度轮换选择分割点（中位数） | 分层分块存储，结合 KD 树划分与 B+树的磁盘优化结构 |
| **存储方式**      | 节点分散存储，无特殊磁盘优化               | 数据分块连续存储，减少随机 I/O                    |
| **动态更新**      | 插入/删除需重构，维护成本高                | 支持批量写入，适合只读/低频更新场景               |
| **查询效率**      | 低维数据 O(log N)，高维退化为 O(N)         | 稳定 O(log N)，通过分块剪枝优化高维查询           |
| **内存/磁盘适用** | 内存友好                                   | 磁盘优化                                          |
| **典型应用**      | 计算机视觉（特征匹配）、低维空间检索       | Elasticsearch/Lucene（数值/地理查询）、大数据存储 |
| **维度适应性**    | 低维（K<20）高效，高维性能骤降             | 支持更高维度，通过分块缓解维数灾难                |
| **实现复杂度**    | 相对简单                                   | 较复杂（需处理分块、压缩、合并等）                |
| **开源应用案例**  | OpenCV、PCL（点云库）                      | Apache Lucene、Elasticsearch                      |

#### 关键区别总结

1. **存储定位**：KD 树为内存优化，BKD 树为磁盘优化
2. **更新策略**：KD 树动态更新困难，BKD 树采用批量写入+合并
3. **高维表现**：BKD 树通过分块机制更好应对高维数据
4. **工程应用**：KD 树适合实时计算，BKD 树适合搜索引擎/数据库底层存储
