# 快速查看 - 深色模式和动画实现

## 🎨 深色模式切换
- **位置**: 顶部导航栏右侧（太阳/月亮图标）
- **动画**: 图标平滑过渡，背景渐变色变化
- **自动保存**: 主题偏好自动存储到 localStorage

## ✨ 已实现的动画效果

### 🎭 入场动画
所有主要页面和组件都有优雅的进场动画：
- 仪表板
- 我的申请
- 审批任务
- 用户管理
- 应用管理

### 📊 统计卡片
- 6 个彩色卡片，带有**错开入场动画** (staggered entrance)
- 每个卡片都有**悬停效果** (hover animation)
- 数字值改变时有**数字动画** (number animation)

### 📋 表格行
- 所有表格行都有**递推式进场**动画
- 行悬停时背景变暗，平滑过渡
- 按钮有**缩放悬停效果** (scale on hover)

### 🎯 其他交互
- 按钮点击缩放反馈 (tap animation)
- 徽章的弹簧缩放效果
- 全局过渡效果（200ms）

## 🌙 深色模式适配

### 颜色方案总览
| 元素 | 深色模式颜色 |
|------|-----------|
| 背景 | `dark:bg-slate-900` / `dark:bg-card` |
| 边框 | `dark:border-slate-700` |
| 主文本 | `dark:text-white` |
| 副文本 | `dark:text-slate-300` / `dark:text-slate-400` |
| 卡片 | `dark:bg-card/50` 半透明 |
| 悬停 | `dark:hover:bg-slate-800/50` |

### 完整适配的页面
✅ 主页 (page.tsx)  
✅ 仪表板 (dashboard/page.tsx)  
✅ 我的申请 (applications/my/page.tsx)  
✅ 用户管理 (admin/users/page.tsx)  
✅ 审批任务 (approvals/tasks/page.tsx)  
✅ 应用管理 (admin/applications/page.tsx)  

### 完整适配的组件
✅ 所有表格（7 个）  
✅ 所有列表和统计卡片  
✅ 对话框和输入框  
✅ 徽章和状态指示器  

## 📱 视觉亮点

### 磨砂玻璃效果
卡片使用 `backdrop-blur-sm` 创建现代的磨砂玻璃效果（仅深色模式）

### 渐变色过渡
所有颜色和背景变化都使用平滑的立方贝塞尔缓动：
```
cubic-bezier(0.4, 0, 0.2, 1)
```

### 弹簧物理效果
交互元素使用 framer-motion 的弹簧配置：
```
{ type: "spring", stiffness: 300 }
```

## 🚀 开发者说明

### 添加新动画的模板

**对于页面**:
```tsx
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <h1 className="dark:text-white">页面内容</h1>
    </motion.div>
  );
}
```

**对于表格**:
```tsx
const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.3 },
  }),
};

<motion.tr
  custom={index}
  initial="hidden"
  animate="visible"
  variants={rowVariants}
  className="dark:hover:bg-slate-800/50"
>
  {/* 内容 */}
</motion.tr>
```

### 深色模式颜色添加检查清单
- [ ] 背景：`dark:bg-*`
- [ ] 文本：`dark:text-*`
- [ ] 边框：`dark:border-*`
- [ ] 悬停：`dark:hover:bg-*` 或 `dark:hover:text-*`
- [ ] 焦点：`dark:focus:*`
- [ ] 禁用：`dark:disabled:*`

## 📊 性能优化

✨ **GPU加速**: 所有动画使用 transform 和 opacity  
⚡ **轻量级**: 无重型布局变化动画  
🎯 **有目的**: 每个动画都增强用户体验，不过度装饰  

## 🔧 相关依赖

- **framer-motion**: 12.27.0 (声明式动画库)
- **next-themes**: 0.4.6 (主题管理)
- **tailwindcss**: v4 (样式框架)

## 📚 完整文档

详见 `DARK_MODE_ANIMATIONS_SUMMARY.md` 获取：
- 所有更改的完整列表
- 代码示例和最佳实践
- 各组件的深色模式适配细节
- 测试检查清单

## 🎯 快速开始

1. **切换主题**: 点击侧边栏顶部的太阳/月亮图标
2. **浏览页面**: 所有页面都有入场动画和完整的深色模式支持
3. **交互测试**: 悬停按钮、表格行、卡片看看动画效果
4. **查看代码**: 参考已更新文件中的模式和最佳实践

---

**提示**: 打开浏览器开发者工具的 Performance 标签可以看到动画帧率（保持 60fps）
