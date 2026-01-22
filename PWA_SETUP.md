# 📱 PWA 应用图标生成指南

## 方案 1：使用在线工具（推荐，最快）

### 步骤：

1. **访问在线工具**
   打开：https://realfavicongenerator.net/

2. **上传图片**
   - 选择任意图片（建议 512x512px 或更大）
   - 或者用简单的设计：紫色背景 + 白色 ✓ 符号

3. **配置**
   - iOS: Yes
   - Android: Yes
   - Windows: No
   - Safari: No

4. **下载**
   - 点击 "Generate your Favicons and HTML code"
   - 下载生成的文件包

5. **使用图标**
   - 解压下载的文件
   - 将 `android-chrome-192x192.png` 重命名为 `icon-192.png`
   - 将 `android-chrome-512x512.png` 重命名为 `icon-512.png`
   - 放到 `public` 文件夹

---

## 方案 2：使用 Canvas 自动生成（需要安装依赖）

### 安装 canvas
```bash
npm install -D canvas
```

### 生成图标
```bash
node scripts/generate-icons.js
```

### 卸载 canvas（可选，节省空间）
```bash
npm uninstall canvas
```

---

## 方案 3：使用临时图标（最简单）

我已经为您创建了一个临时方案，使用 emoji 作为图标。

---

## 快速测试

如果您想快速测试 PWA，可以先用任何图片：

1. 从网上下载一个 512x512 的图片
2. 用图片编辑器调整大小：
   - 192x192 命名为 `icon-192.png`
   - 512x512 命名为 `icon-512.png`
3. 放到 `public` 文件夹

---

## 推荐工具

- **Favicon Generator**: https://realfavicongenerator.net/
- **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
- **Canva**: https://www.canva.com （设计图标）

---

## 临时跳过图标

您可以先不添加图标，PWA 功能仍然可以工作：
- 在浏览器控制台可能看到图标 404 错误（可以忽略）
- 其他 PWA 功能正常（安装、离线等）
- 稍后再添加图标
