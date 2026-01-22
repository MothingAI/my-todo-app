# 部署指南 / Deployment Guide

## 构建结果

您的项目已成功构建！构建产物位于 `dist` 文件夹：

- **index.html**: 0.46 kB (gzip: 0.29 kB)
- **CSS**: 38.25 kB (gzip: 7.83 kB)
- **JS**: 602.05 kB (gzip: 183.68 kB)
- **总大小**: ~640 kB (gzip 后 ~192 kB)

## 部署方案

### 🌟 方案 1：Vercel（推荐）

**优点：**
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 零配置，自动 CI/CD
- ✅ 每次推送自动部署

#### 方式 1A：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

#### 方式 1B：通过网站（更简单）

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入您的 `my-todo-app` 仓库
5. Vercel 会自动检测 Vite 项目
6. 点击 "Deploy" - 完成！

**配置：**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

部署后，您会获得一个类似 `https://my-todo-app.vercel.app` 的域名。

---

### 🔥 方案 2：Netlify

**优点：**
- ✅ 免费，功能丰富
- ✅ 支持 Forms、Functions
- ✅ 拖拽部署

#### 通过网站部署：

1. 访问 [netlify.com](https://netlify.com)
2. 注册/登录
3. 拖拽 `dist` 文件夹到 Netlify
4. 完成！几秒钟内获得一个 URL

#### 通过 Git 持续部署：

1. 在 Netlify 中点击 "New site from Git"
2. 选择 GitHub
3. 选择您的仓库
4. 配置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. 点击 "Deploy site"

---

### 📦 方案 3：GitHub Pages

**优点：**
- ✅ 完全免费
- ✅ 与 GitHub 集成
- ✅ 适合开源项目

#### 部署步骤：

1. **安装 gh-pages**
```bash
npm install -D gh-pages
```

2. **更新 package.json**
在 `scripts` 部分添加：
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/my-todo-app"
}
```

3. **更新 vite.config.ts**
如果部署到子路径（非根路径），需要添加 `base`：
```typescript
export default defineConfig({
  base: '/my-todo-app/',
  // ... 其他配置
})
```

4. **构建并部署**
```bash
npm run deploy
```

5. 访问 `https://yourusername.github.io/my-todo-app`

---

### 🖥️ 方案 4：自托管 / 传统服务器

适用于您有自己的服务器（VPS、云服务器等）。

#### 使用 Nginx：

1. **构建项目**
```bash
npm run build
```

2. **上传到服务器**
```bash
# 使用 scp 上传
scp -r dist/* user@your-server:/var/www/my-todo-app/
```

3. **Nginx 配置**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/my-todo-app;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **重启 Nginx**
```bash
sudo systemctl restart nginx
```

---

## 本地预览构建结果

在部署前，您可以本地预览构建后的网站：

```bash
npm run preview
```

这会在 `http://localhost:4173` 启动一个服务器，模拟生产环境。

---

## 环境变量（可选）

如果您需要配置环境变量：

### Vercel
在项目设置 → Environment Variables 中添加

### Netlify
在 Site settings → Build & deploy → Environment 中添加

### GitHub Pages
在仓库设置 → Secrets 中添加，然后在构建时使用

---

## 自定义域名

### Vercel
1. 进入项目设置
2. Domains → Add Domain
3. 按照提示配置 DNS

### Netlify
1. Domain settings → Add custom domain
2. 配置您的 DNS

### GitHub Pages
在仓库的 Settings → Pages 中配置自定义域名

---

## 性能优化建议

### 1. 启用 CDN
所有推荐平台（Vercel/Netlify）都提供全球 CDN

### 2. 启用压缩
您的 Vite 配置已启用 gzip 压缩

### 3. 图片优化
子任务的图片已经在上传时压缩到 ≤500KB

### 4. 缓存策略
Vercel/Netlify 自动处理缓存头

---

## 监控和分析（可选）

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Google Analytics
在 `index.html` 中添加 Google Analytics 脚本

---

## 故障排查

### 构建失败
```bash
# 清理并重新构建
rm -rf node_modules dist
npm install
npm run build
```

### 路由 404 错误
确保服务器配置了 SPA 路由支持（所有路径指向 index.html）

### localStorage 问题
部署后 localStorage 仍然工作，数据存储在用户浏览器中

---

## 推荐选择

- **最快最简单**: Vercel（2 分钟部署）
- **开源项目**: GitHub Pages
- **需要更多功能**: Netlify
- **企业级/自控**: 自托管

---

## 下一步

1. 选择一个部署平台
2. 按照对应步骤部署
3. 测试您的应用
4. 分享您的应用链接！

**祝您部署顺利！🚀**
