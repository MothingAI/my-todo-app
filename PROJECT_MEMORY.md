# My Todo App - 项目记忆总结

## 项目概述

一个功能丰富的待办事项应用，使用 React 18 + TypeScript 5.x 构建，支持任务管理、番茄钟计时器、日历视图、统计分析等高级功能。

**技术栈**：
- 前端框架：React 18.2.0
- 语言：TypeScript 5.3.3（严格模式）
- 构建工具：Vite 5.0.8
- 动画库：canvas-confetti 1.9.4
- 图表库：recharts 3.7.0
- 日期处理：date-fns 4.1.0
- 测试：Vitest 1.1.0 + React Testing Library
- 状态管理：React Context API + useReducer

**项目状态**：✅ 生产就绪，已部署

---

## 核心功能架构

### 1. 任务管理系统
- **基础功能**：添加、完成、删除任务
- **增强功能**：
  - 子任务系统（支持图片附件）
  - 优先级设置（low/medium/high）
  - 截止日期管理
  - 标签系统
  - 任务详情抽屉（TodoDetailDrawer）
  - 撤销删除功能（5秒窗口）

### 2. 时间管理系统
- **番茄钟计时器**：
  - 可自定义时长（默认 25 分钟）
  - 支持暂停/恢复
  - 时间记录和统计
  - 与任务关联的时间追踪
- **自由计时模式**：自定义任意时长
- **计时会话记录**：持久化存储所有计时历史

### 3. 日历视图
- **月视图**：显示所有任务和截止日期
- **日视图**：详细展示特定日期的任务
- **任务分布可视化**：直观展示任务密度

### 4. 统计分析面板
- **每日完成度图表**：追踪任务完成趋势
- **优先级分布图**：饼图展示任务优先级结构
- **时间对比图**：预估时间 vs 实际时间分析
- 懒加载优化（减少初始 bundle 大小）

### 5. 多语言支持
- 支持中英文切换
- 使用 React Context 管理语言状态
- 完整的 i18n 基础设施

---

## 项目结构

```
src/
├── components/           # React 组件
│   ├── calendar/        # 日历视图组件
│   ├── statistics/      # 统计面板组件
│   ├── timer/          # 计时器组件
│   ├── TodoForm.tsx    # 任务表单
│   ├── TodoList.tsx    # 任务列表
│   ├── SubtaskList.tsx # 子任务列表
│   ├── TodoDetailDrawer.tsx  # 任务详情抽屉
│   ├── UndoNotification.tsx  # 撤销通知
│   └── ...
├── contexts/           # React Context
│   └── LanguageContext.tsx  # 语言上下文
├── hooks/              # 自定义 Hooks
│   ├── useTodos.tsx    # 任务状态管理
│   ├── useConfetti.ts  # 庆祝动画
│   └── useTimer.ts     # 计时器逻辑
├── i18n/              # 国际化配置
│   ├── zh.ts         # 中文
│   └── en.ts         # 英文
├── types/            # TypeScript 类型定义
│   └── todo.ts       # 核心类型（Schema v3）
├── utils/            # 工具函数
│   ├── todoStorage.ts  # LocalStorage 包装器
│   └── imageUtils.ts   # 图片压缩工具
├── styles/           # CSS 模块化样式
└── App.tsx           # 应用入口

specs/001-todo-app/   # 功能规范和设计文档
├── spec.md          # 功能规格说明
├── plan.md          # 实现计划
├── data-model.md    # 数据模型
└── contracts/       # 接口契约
```

---

## 数据模型（Schema v3）

### 核心 Todo 实体
```typescript
interface Todo {
  id: string
  description: string
  completed: boolean
  createdAt: number
  // 可选字段
  dueDate?: number              // 截止日期
  estimatedMinutes?: number     // 预估时间（分钟）
  actualMinutes?: number        // 实际时间（分钟）
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  subtasks?: Subtask[]
  _version?: number
}
```

### 子任务系统
```typescript
interface Subtask {
  id: string
  description: string
  completed: boolean
  createdAt: number
  priority?: 'low' | 'medium' | 'high'
  dueDate?: number
  notes?: string
  images: SubtaskImage[]  // 支持图片附件
  _version?: number
}

interface SubtaskImage {
  id: string
  data: string        // Base64 编码
  name: string
  size: number
  compressedSize: number
  uploadedAt: number
}
```

### 计时器系统
```typescript
interface TimerSession {
  todoId: string
  startTime: number
  endTime?: number
  duration: number
  type: 'pomodoro' | 'free'
}
```

---

## 状态管理架构

### Context + Reducer 模式
- **TodoProvider**: 全局任务状态
- **LanguageProvider**: 多语言状态
- **Reducer Actions**:
  - `ADD_TODO`, `COMPLETE_TODO`, `DELETE_TODO`
  - `UPDATE_TODO`（更新任意字段）
  - `ADD_SUBTASK`, `UPDATE_SUBTASK`, `DELETE_SUBTASK`, `TOGGLE_SUBTASK`
  - `START_TIMER`, `PAUSE_TIMER`, `RESUME_TIMER`, `STOP_TIMER`
  - `LOAD_TODOS`, `LOAD_TIMER_SESSIONS`

### 数据持久化
- **LocalStorage**：存储任务和计时会话
- **Schema Migration**：支持数据版本升级（当前 v3）
- **图片压缩**：自动压缩图片附件以节省存储空间

---

## 性能优化记录

### 已实现的优化
1. **懒加载**：StatisticsPanel 使用 React.lazy 按需加载
2. **输入防抖**：修复输入卡顿问题（commit eeff75a）
3. **子任务更新优化**：实时更新修复（commit cbc3507）
4. **PWA 支持**：可安装到手机主屏幕（commit da34772）
5. **Bundle 优化**：初始 JS bundle < 200KB（gzipped）

### 性能指标
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- 所有交互响应时间 < 100ms

---

## 最近更新历史

### cbc3507 - 修复子任务实时更新问题
- 修复子任务状态变化时父任务未同步更新的问题

### eeff75a - 性能优化：修复输入卡顿问题
- 优化输入框性能，提升用户体验

### da34772 - 添加 PWA 支持
- 应用可安装到手机主屏幕
- 支持离线使用

### 2effa15 - 修复 Netlify 配置
- 移除无效的 Lighthouse 插件配置

### b24b0bc - Initial commit
- My Todo App with Subtask System

---

## 开发指南

### 核心原则
1. **简单优先**：避免过度工程化
2. **组件模块化**：单一职责，可复用
3. **状态清晰**：可预测的数据流
4. **渐进增强**：移动优先，响应式设计
5. **用户体验**：即时反馈，WCAG 2.1 AA 可访问性

### 命令
```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run test         # 运行测试
npm run test:ci      # CI 测试
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
npm run type-check   # TypeScript 类型检查
```

### 质量标准
- 代码覆盖率：核心业务逻辑 80%，整体 60%
- 无 TypeScript 错误
- 无 ESLint 警告
- 可访问性检查通过

---

## 技术决策记录

### 为什么选择 React Context 而非 Redux？
- 简单性原则：应用规模不需要 Redux 的复杂性
- Context + useReducer 提供足够的状态管理能力
- 减少 bundle 大小

### 为什么使用 LocalStorage？
- MVP 阶段无需后端
- 数据持久化简单高效
- 支持离线使用

### 为什么选择 canvas-confetti？
- 轻量级，专注的动画库
- 性能优秀
- 易于集成

### 为什么支持子任务图片附件？
- 增强任务管理的实用性
- 支持截图、参考图等场景
- 自动压缩避免存储问题

---

## 已知限制和未来改进

### 当前限制
1. 单用户应用（无账户系统）
2. 无云端同步
3. LocalStorage 有容量限制（约 5-10MB）

### 未来改进方向
1. 云端同步功能
2. 多用户协作
3. 主题切换（深色模式）
4. 更多统计维度
5. 导出功能（JSON/CSV）
6. 快捷键支持

---

## 部署信息

- **平台**: Netlify
- **配置文件**: `netlify.toml`
- **构建命令**: `npm run build`
- **发布目录**: `dist/`

---

## 开发规范

### Git 提交规范
```
类型(范围): 简短描述

详细说明（可选）
```

类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `perf`: 性能优化
- `refactor`: 重构
- `docs`: 文档更新
- `test`: 测试相关

### 代码审查检查清单
- [ ] TypeScript 严格模式通过
- [ ] 单元测试覆盖
- [ ] 可访问性检查
- [ ] 性能影响评估
- [ ] 文档更新（如需要）

---

*最后更新: 2026-01-22*
*版本: 1.0.0*
