# Vue3 项目腾讯云部署指南

## 1. 服务器购买与配置

### 1.1 购买服务器
1. 进入腾讯云官网，搜索"轻量应用服务器"
2. 选择适合个人应用的配置方案（推荐配置）：
   - 2核4G内存
   - 系统：CentOS 7+ / Ubuntu 18.04+
   - 带宽：5Mbps+

### 1.2 服务器初始配置
1. 登录服务器控制台
2. 重置服务器密码（必要步骤）：
   - 在控制台找到"重置密码"选项
   - 设置新的安全密码
   - 记录用户名（默认为 root）

## 2. 连接工具安装

### 2.1 下载安装连接工具
1. 访问 [NetSarang 官网](https://www.xshell.com/zh/free-for-home-school/)
2. 下载 Xshell 和 Xftp（家庭/学校免费版）：
   - 填写姓名和邮箱
   - 通过邮箱接收下载链接
   - 下载并安装软件

### 2.2 配置 Xshell 连接
1. 打开 Xshell，点击"新建"
2. 填写连接信息：
   - 名称：自定义
   - 主机：服务器公网IP
   - 协议：SSH
   - 端口：22
3. 配置身份验证：
   - 方法：Password
   - 用户名：root
   - 密码：之前重置的密码

### 2.3 配置 Xftp 连接
1. 打开 Xftp，点击"新建"
2. 填写连接信息：
   - 名称：项目名称
   - 主机：服务器公网IP
   - 协议：SFTP
   - 端口：22
3. 身份验证：
   - 用户名：root
   - 密码：服务器密码

## 3. 项目部署

### 3.1 创建项目目录
\`\`\`bash
# 创建网站根目录
mkdir -p /www/wwwroot/my-vue3-app
\`\`\`

### 3.2 上传项目文件
1. 本地项目打包：
\`\`\`bash
npm run build
\`\`\`

2. 使用 Xftp 上传：
   - 连接服务器
   - 导航到 /www/wwwroot/my-vue3-app
   - 将本地 dist 目录下的所有文件拖拽到服务器目录

## 4. Nginx 配置

### 4.1 安装 Nginx
\`\`\`bash
# CentOS 系统
yum install -y nginx

# Ubuntu 系统
apt install -y nginx
\`\`\`

### 4.2 配置 Nginx
1. 进入 Nginx 配置目录：
\`\`\`bash
cd /etc/nginx/conf.d
\`\`\`

2. 创建项目配置文件：
\`\`\`bash
vim my-vue3-app.conf
\`\`\`

3. 添加配置内容：
\`\`\`nginx
server {
    listen 80;
    server_name your-server-ip;  # 替换为你的服务器IP或域名
    
    root /www/wwwroot/my-vue3-app;
    index index.html;
    
    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location /assets {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
\`\`\`

### 4.3 启动服务
\`\`\`bash
# 测试配置
nginx -t

# 启动 Nginx
systemctl start nginx

# 设置开机自启
systemctl enable nginx
\`\`\`

## 5. 防火墙配置

### 5.1 开放端口
\`\`\`bash
# CentOS 系统
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# Ubuntu 系统
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
\`\`\`

## 6. 访问测试

1. 在浏览器中输入服务器IP地址或域名
2. 检查网站是否正常访问
3. 检查页面路由是否正常工作
4. 检查静态资源是否正确加载

## 7. 常见问题处理

### 7.1 访问 404
- 检查 Nginx 配置中的 root 路径是否正确
- 确认项目文件是否正确上传
- 检查文件权限

### 7.2 静态资源无法加载
- 检查 Nginx 配置中的路径配置
- 确认文件权限设置
- 检查防火墙配置

### 7.3 跨域问题
如需配置跨域，在 Nginx 配置中添加：
\`\`\`nginx
location /api {
    proxy_pass http://your-backend-api;
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
}
\`\`\`

## 8. 维护命令

\`\`\`bash
# Nginx 操作
systemctl start nginx    # 启动
systemctl stop nginx     # 停止
systemctl restart nginx  # 重启
systemctl reload nginx   # 重新加载配置

# 查看日志
tail -f /var/log/nginx/error.log    # 错误日志
tail -f /var/log/nginx/access.log   # 访问日志

# 查看 Nginx 状态
systemctl status nginx
\`\`\` 