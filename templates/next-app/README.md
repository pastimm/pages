# next-app

Next.js 模板项目，由 Rush 管理。

## 本地运行（开发）

```bash
# 在仓库根目录
rushx dev --project next-app

# 或进入本目录
cd templates/next-app
rushx dev
```

访问 http://localhost:3000

## 部署本地访问（使用已有构建产物）

若已执行过 `rush build --to next-app` 或在本目录执行过 `rushx build`，可直接用生产模式启动：

```bash
cd templates/next-app
rushx start
```

启动后会显示两个地址：

- **Local**：本机访问 `http://localhost:3000`
- **Network**：同一局域网内其他设备用该地址访问（如 `http://100.82.79.167:3000`）

无需额外参数，其他设备直接用终端里显示的 **Network** 地址即可。

## 指定端口

如需使用其他端口（例如 3001）：

```bash
rushx start -- -p 3001
```

访问 http://localhost:3001

## 使用 PM2 管理进程

用 PM2 常驻运行 Next.js 生产进程，崩溃自动重启，便于配合 Nginx 部署。

### 1. 安装 PM2（未安装时）

```bash
npm install -g pm2
# 或
pnpm add -g pm2
```

### 2. 确保已构建

```bash
cd templates/next-app
rushx build
```

### 3. 启动 / 停止 / 重启

```bash
cd templates/next-app
pm2 start deploy/ecosystem.config.cjs
```

常用命令：

| 命令 | 说明 |
|------|------|
| `pm2 list` | 查看进程列表 |
| `pm2 stop next-app` | 停止 |
| `pm2 restart next-app` | 重启 |
| `pm2 delete next-app` | 从 PM2 中移除 |
| `pm2 logs next-app` | 查看日志 |
| `pm2 monit` | 实时监控 |

### 4. 开机自启（可选）

```bash
pm2 startup   # 按提示执行生成的命令
pm2 save      # 保存当前进程列表
```

### 5. 访问

进程启动后，本机访问 **http://localhost:3000**，或配合 Nginx 使用 **http://localhost**（80 端口）。

## 其他设备访问（同一局域网）

Next.js 15 的 `rushx start` **默认已监听所有网卡**，启动时会在终端打印 **Network** 地址（如 `http://100.82.79.167:3000`）。同一 Wi-Fi 下的手机、平板、其他电脑在浏览器里打开该地址即可访问，无需再加 `-H 0.0.0.0`。

若未显示 Network 或其他设备无法访问，可显式指定监听所有接口：

```bash
rushx start:lan
# 或
rushx start -- -H 0.0.0.0 -p 3000
```

仍无法访问时，检查本机防火墙是否放行 3000 端口。

## 通过 Nginx 部署

使用 Nginx 做反向代理：对外 80 端口，背后转发到 Next.js（3000 端口），便于加 HTTPS、缓存、多实例等。

### 1. 确保 Next.js 已构建并运行

```bash
cd templates/next-app
rushx build
rushx start
```

保持 Next.js 运行（推荐用 [PM2 管理进程](#使用-pm2-管理进程)）。

### 2. 安装 Nginx（未安装时）

- **macOS**：`brew install nginx`
- **Ubuntu/Debian**：`sudo apt install nginx`
- **CentOS/RHEL**：`sudo yum install nginx`

### 3. 使用项目内配置

配置已放在 `deploy/nginx.conf`，按下面方式之一让 Nginx 加载。

**方式 A：拷贝到 Nginx 配置目录**

- macOS（Homebrew）：`sudo cp deploy/nginx.conf /opt/homebrew/etc/nginx/servers/next-app.conf`（或 `/usr/local/etc/nginx/servers/`）
- Linux（sites-available）：`sudo cp deploy/nginx.conf /etc/nginx/sites-available/next-app.conf`，再 `sudo ln -s /etc/nginx/sites-available/next-app.conf /etc/nginx/sites-enabled/`

**方式 B：在主配置里 include**

在 `nginx.conf` 的 `http { ... }` 内增加一行：

```nginx
include /path/to/pages/templates/next-app/deploy/nginx.conf;
```

### 4. 校验并重载 Nginx

```bash
sudo nginx -t
sudo nginx -s reload
```

### 5. 访问

- 本机：**http://localhost**（80 端口）
- 其他设备：**http://&lt;本机IP&gt;**（同一局域网）

如需改域名，编辑 `deploy/nginx.conf` 中的 `server_name`；如需 HTTPS，在 Nginx 中配置 `listen 443 ssl` 和证书，并保留 `X-Forwarded-Proto $scheme`。
