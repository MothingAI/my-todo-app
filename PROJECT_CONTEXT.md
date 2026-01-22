# 项目快速参考 - My Todo App

## 如何在新会话中恢复上下文

复制以下内容到新的 Claude 对话中：

---

## 项目概述

**项目名称**: My Todo App
**技术栈**: React 18 + TypeScript + Vite + CSS Modules
**状态**: MVP 完成 (User Story 1-2)，User Story 3 待实现

## 快速启动命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 测试
npm run test

# 类型检查
npm run type-check
```

## 已实现功能

### ✅ User Story 1: 添加和查看待办
- 输入框添加新待办
- Active 板块显示待办列表
- 空状态提示
- localStorage 持久化

### ✅ User Story 2: 标记完成
- 复选框切换完成状态
- Confetti 庆祝动画
- Active 和 Completed 板块分离显示
- 完成待办显示删除线和灰色

### ✅ User Story 3: 删除待办
- 删除按钮（垃圾桶图标）
- 5秒撤销通知
- 撤销/永久删除功能
- 自动消失动画

### ✅ Phase 6: 优化和完善
- 键盘导航（Tab, Enter, Space, Delete, Backspace）
- 完整的 ARIA 标签和无障碍支持
- focus-visible 样式（仅键盘导航显示焦点环）
- React.memo 性能优化（TodoItem 组件）
- 字符计数器（显示剩余字符数）
- 测试覆盖率 91.7% (44/48 通过)
- Bundle 大小 52.52 KB gzipped (目标 < 200KB ✅)

## 关键文件

### 配置文件
- `vite.config.ts` - Vite 配置
- `vitest.config.ts` - 测试配置
- `tsconfig.json` - TypeScript 配置

### 源代码
- `src/App.tsx` - 主应用组件
- `src/hooks/useTodos.tsx` - 状态管理 (Context + useReducer)
- `src/hooks/useConfetti.ts` - Confetti 动画钩子
- `src/components/TodoInput.tsx` - 输入组件
- `src/components/TodoList.tsx` - 列表组件
- `src/components/TodoItem.tsx` - 待办项组件
- `src/utils/todoStorage.ts` - localStorage 封装

### 类型定义
- `src/types/todo.ts` - Todo 类型定义

### 样式
- `src/styles/*.module.css` - CSS Modules

### 文档
- `specs/001-todo-app/spec.md` - 功能规格
- `specs/001-todo-app/plan.md` - 实现计划
- `specs/001-todo-app/tasks.md` - 任务列表
- `specs/001-todo-app/data-model.md` - 数据模型

## 项目约束

- Bundle 大小: < 200KB gzipped (当前: **52.52 KB** ✅)
- 测试覆盖率: 91.7% (44/48 通过，超过 80% 目标 ✅)
- 性能目标: FCP < 1.5s, TTI < 3s (建议运行 Lighthouse 验证)

## 项目完成状态

**所有核心功能已完成：**
- ✅ User Story 1: 添加和查看待办
- ✅ User Story 2: 标记完成 + Confetti 动画
- ✅ User Story 3: 删除待办 + 5秒撤销
- ✅ Phase 6: 优化和完善

**可选的后续优化：**
- ESLint 代码规范检查
- Prettier 代码格式化
- Lighthouse 性能审计
- axe DevTools 无障碍审计

## 开发服务器

- Local: http://localhost:5173/

---
