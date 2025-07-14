---
title: ElasticSearch Demo
date: 2025-7-14
categories:
  - elasticSearch
sidebar: 'auto'
publish: true
showSponsor: true
---

## ElasticSearch Demo

::: right 

[Elasticsearch 翻译说明](https://elasticsearch.bookhub.tech/)

来自 [Sapphire611](http://sapphire611.github.io)

:::

Elasticsearch 是一种分布式文档存储。Elasticsearch 不用列数据行存储信息，而是存储已序列化为 JSON 文档的复杂数据结构。当集群中有多个 Elasticsearch 节点时，存储的文档将分布在集群中，且可以从任何节点直接访问。

Elasticsearch 使用一种称之为倒排索引的数据结构，支持非常快的全文搜索。倒排索引列出任何文档中出现的唯一单词，并标识每个单词出现的所有文档。

默认情况下，Elasticsearch 索引每个字段中的所有数据，且每个被索引的字段有一个专用的优化数据结构。例如，文本字段被存储在倒排索引中，数字和地理字段存储在 BKD 树 中。使用每个字段的数据结构来聚集和返回搜索结果是让 Elasticsearch 如此快的原因。

## 1. 使用docker拉取elasticSearch

```bash
docker network create elastic

docker pull docker.elastic.co/elasticsearch/elasticsearch:8.17.0
docker pull docker.elastic.co/kibana/kibana:8.17.0

docker run --name es01 -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node"  -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.17.0

docker run --name kib01 -p 5601:5601 -e "ELASTICSEARCH_HOSTS=http://host.docker.internal:9200" docker.elastic.co/kibana/kibana:8.17.0
```

## 2. 通过RESTFUL API创建索引

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


[更多demo搜索可以查看文档，很详细](https://elasticsearch.bookhub.tech/getting_started/esindex)

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

#### 字段名称是state，为什么要加上.keyword ? 

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

> 是一个开源的日志分析平台,正确配置后，点击左边Discover菜单，就可以看到数据并查询了

```kql
age: 40
state.keyword: "UT"
balance > 30000
age: 40 AND NOT state.keyword: "ID"
```

[Kibana中的KQL语法使用](https://www.cnblogs.com/liyuanhong/articles/18308379)