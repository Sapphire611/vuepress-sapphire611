---
title: Docker 相关整理
date: 2025-6-19
categories:
  - deploy
tags:
  - docker
  - network
sidebar: "auto"
publish: true
showSponsor: true
---

## Docker 相关整理

## docker 常用的网络模式有哪些?
| 网络模式       | 特点                                                                 | 适用场景                              | 示例命令                                                                 |
|----------------|----------------------------------------------------------------------|---------------------------------------|--------------------------------------------------------------------------|
| **Bridge**     | 默认通过 `docker0` 网桥通信，NAT 转发，容器间通过 IP 互通             | 单机多容器开发环境                    | `docker run -d --name my_container -p 8080:80 nginx`                     |
| **Host**       | 直接共享主机网络，无隔离，高性能                                      | 需高性能或直接使用主机端口的场景      | `docker run -d --name my_container --network host nginx`                 |
| **None**       | 无网络配置，完全隔离                                                 | 安全测试或离线数据处理                | `docker run -d --name my_container --network none alpine sleep 3600`      |
| **Overlay**    | 跨主机通信，基于 VXLAN，适用于集群                                    | Docker Swarm/Kubernetes 集群          | ```docker network create -d overlay my_net```<br>```docker service create --network my_net nginx``` |
| **Macvlan**    | 为容器分配独立 MAC 地址，直接接入物理网络                             | 容器需作为物理网络设备                | ```docker network create -d macvlan --subnet=192.168.1.0/24 -o parent=eth0 my_macvlan```<br>```docker run --network my_macvlan -d nginx``` |
| **IPvlan**     | 类似 Macvlan，但共享 MAC 地址，通过不同 IP 区分                       | 避免 MAC 地址泛滥的网络环境           | ```docker network create -d ipvlan --subnet=192.168.1.0/24 -o parent=eth0 my_ipvlan``` |
| **自定义桥接** | 用户自定义桥接网络，支持 DNS 自动解析容器名                           | 单机内容器需通过名称通信（如微服务）  | ```docker network create my_bridge```<br>```docker run -d --name web --network my_bridge nginx``` |