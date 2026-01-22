# ⚠️ 警告：不推荐提交 dist 文件夹

## 为什么不推荐？

1. **dist 是构建产物**，应该由部署平台生成
2. **增加仓库大小**（3.2MB）
3. **可能导致冲突**（不同环境构建结果不同）
4. **没有必要**（Netlify 会自动构建）

## 如果坚持要提交（不推荐）

```bash
# 强制添加 dist 文件夹
git add -f dist/

# 提交
git commit -m "Add dist folder"

# 推送
git push
```

## 更好的做法

保持现在的配置：
- ✅ .gitignore 忽略 dist
- ✅ 只提交源代码
- ✅ Netlify 自动构建
- ✅ 这是行业标准做法
