---
# 这是文章的标题
title: Docker会话
# 你可以自定义封面图片
cover: /assets/images/cover1.jpg
# 这是页面的图标
icon: fa-brands fa-docker
# 这是侧边栏的顺序
order: 1
# 设置作者
author: TheBlind
# 设置写作时间
date: 2026-01-12
# 一个页面可以有多个分类
category:
  - 使用指南
# 一个页面可以有多个标签
tag:
  - 页面配置
  - 使用指南
# 此页面会在文章列表置顶
sticky: true
# 此页面会出现在星标文章中
star: true

---


## Docker连接 

### 0.启动Remote API
Tshell 的 docker 管理 基于 Remote API
### 方法一：编辑 Docker 服务配置文件

1. **编辑 Docker 服务文件**：

    ```bash
    sudo vim /lib/systemd/system/docker.service
    
    ```

2. **修改 `ExecStart` 行**，添加 `H tcp://0.0.0.0:2375`，使其如下所示：

    ```bash
    ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
    
    ```

   这将使 Docker 守护进程同时监听 TCP 端口 2375 和 Unix 套接字。
   建议设置为tcp://127.0.0.1:XXXX 仅本机监听，通过SSH隧道使用，安全考虑不使用默认端口

3. **重新加载 systemd 配置并重启 Docker 服务**：
    ```bash
      sudo systemctl daemon-reload
      sudo systemctl restart docker
    
    ```
### 1.管理

双节会话行，即可连接

<img src="/assets/image/docker-container.png"/>

### 2.容器详情
<img src="/assets/image/docker-container-details.png"/>
<img src="/assets/image/docker-container-resources.png"/>

### 3.容器Shell
<img src="/assets/image/docker-container-details2.png"/>
<img src="/assets/image/docker-container-shell.png"/>

### 常见问题
#### 启用





