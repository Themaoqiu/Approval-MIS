# 高级功能实现说明

本文档说明了已完成的三大高级功能模块的实现细节。

## ✅ 已完成功能

### 1. 统计功能模块

#### 1.1 个人统计
**页面路径**: `/statistics/personal`

**功能特性**:
- 总申请数、已通过、已拒绝、通过率等关键指标
- 申请趋势图（折线图）：显示每日/每月申请数量变化
- 申请类型分布（饼图）：按请假、报销等分类统计
- 状态分布（柱状图）：已通过、已拒绝、待处理数量对比
- 平均审批时长：从申请到完成的平均小时数
- 支持月度/年度切换查看

**使用的图表库**: `recharts`
- LineChart：趋势分析
- PieChart：类型分布
- BarChart：状态对比

**API接口**: 
- `GET /api/statistics/personal?period=monthly&year=2026&month=1`

#### 1.2 部门统计
**页面路径**: `/admin/statistics/department` (仅管理员可访问)

**功能特性**:
- 各部门申请量对比柱状图
- 部门申请详情卡片：总数、通过、拒绝、通过率
- 支持按年月筛选

**API接口**:
- `GET /api/statistics/department?year=2026&month=1`

#### 1.3 数据表设计
```prisma
model Statistics {
  statId    Int      @id @default(autoincrement())
  userId    String?
  deptId    Int?
  statType  String   @db.VarChar(20)
  period    String   @db.VarChar(20)
  date      DateTime
  metrics   Json
  createdAt DateTime @default(now())
}
```

**当前实现**: 实时计算统计数据（查询 Application 表）
**优化方向**: 可后续添加定时任务预计算数据写入 Statistics 表

---

### 2. 动态表单配置模块

#### 2.1 表单设计器
**页面路径**: `/admin/forms/new`（新建）、`/admin/forms/[id]/edit`（编辑）

**核心组件**:
1. **FieldLibrary** (字段库面板)
   - 支持的字段类型：文本框、数字、多行文本、下拉选择、日期、日期范围、复选框
   - 点击即可添加字段到画布

2. **DesignCanvas** (画布区域)
   - 使用 `@hello-pangea/dnd` 实现拖拽排序
   - 显示所有字段，支持选中编辑
   - 删除字段功能

3. **PropertyPanel** (属性配置面板)
   - 字段标签、占位符配置
   - 必填字段开关
   - 下拉选择：配置选项列表
   - 文本字段：最小/最大长度验证
   - 数字字段：最小/最大值验证

**状态管理**: 使用 `zustand` 管理设计器状态
```typescript
// lib/stores/form-designer-store.ts
- fields: FormField[]
- selectedFieldId: string | null
- addField(), removeField(), updateField()
- reorderFields(), loadSchema(), clearFields()
```

#### 2.2 表单模板管理
**页面路径**: `/admin/forms`

**功能特性**:
- 表单列表（表格视图）
- 创建、编辑、删除表单
- 表单状态：启用/停用
- 系统表单不可删除保护

#### 2.3 表单数据结构
**数据库表**:
```prisma
model FormTemplate {
  formId    Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  code      String   @unique @db.VarChar(50)
  category  String   @db.VarChar(50)
  version   Int      @default(1)
  schema    Json
  isActive  Boolean  @default(true)
  isSystem  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**schema 字段结构示例**:
```json
{
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "申请标题",
      "required": true,
      "placeholder": "请输入标题",
      "validation": {
        "maxLength": 100
      }
    },
    {
      "id": "field_2",
      "type": "select",
      "label": "费用类型",
      "required": true,
      "options": [
        {"label": "差旅费", "value": "travel"},
        {"label": "餐饮费", "value": "meal"}
      ]
    }
  ]
}
```

#### 2.4 API接口
- `GET /api/admin/forms` - 获取表单列表
- `POST /api/admin/forms` - 创建表单
- `GET /api/admin/forms/[id]` - 获取表单详情
- `PUT /api/admin/forms/[id]` - 更新表单
- `DELETE /api/admin/forms/[id]` - 删除表单

---

### 3. 自定义审批人指派模块

#### 3.1 审批人选择器组件
**组件路径**: `components/approver-selector/ApproverSelector.tsx`

**功能特性**:
1. **三种选择方式** (Tabs)
   - **搜索**: 按用户名、姓名、邮箱搜索
   - **按部门**: 左侧部门树，右侧该部门用户列表
   - **按岗位**: 左侧岗位列表，右侧该岗位用户列表

2. **交互特性**:
   - 支持单选/多选模式
   - 已选人员显示在顶部，可快速移除
   - Checkbox 选择，点击行也可触发选择
   - 显示用户头像、姓名、部门、岗位信息

3. **使用的组件**:
   - Dialog: 弹窗容器
   - Tabs: 三种选择方式切换
   - ScrollArea: 滚动列表
   - Avatar: 用户头像
   - Checkbox: 选择框

**使用示例**:
```tsx
import { ApproverSelector } from "@/components/approver-selector/ApproverSelector";

<ApproverSelector
  open={selectorOpen}
  onOpenChange={setSelectorOpen}
  selectedUserIds={selectedUserIds}
  onConfirm={handleConfirm}
  mode="multiple"  // 或 "single"
/>
```

#### 3.2 审批人建议API
**接口**: `POST /api/approvers/suggest`

**支持的分配策略**:
1. **dept_leader** (部门负责人)
   - 查询用户所在部门的 leader 字段
   - 返回该负责人信息

2. **post** (按岗位)
   - 根据岗位ID列表查询所有担任该岗位的用户
   - 返回用户列表

3. **direct_superior** (直接上级)
   - 查询用户部门的上级部门
   - 返回上级部门负责人

**请求示例**:
```json
{
  "assignType": "dept_leader",
  "userId": "user123"
}
```

**响应示例**:
```json
{
  "approvers": [
    {
      "id": "leader1",
      "name": "张经理",
      "dept": "技术部",
      "avatar": "..."
    }
  ]
}
```

#### 3.3 用户搜索API
**接口**: `GET /api/approvers/search?q=keyword&deptId=1`

**功能特性**:
- 支持按用户名、姓名、邮箱模糊搜索
- 支持按部门筛选
- 返回用户详细信息（包含部门、岗位）
- 最多返回 50 条结果

#### 3.4 演示页面
**页面路径**: `/admin/approver-demo`

展示了如何集成和使用审批人选择器组件。

---

## 🛠️ 技术栈

| 技术 | 用途 | 版本 |
|------|------|------|
| `@hello-pangea/dnd` | 表单设计器拖拽功能 | 18.0.1 |
| `recharts` | 统计图表可视化 | 3.6.0 |
| `zustand` | 表单设计器状态管理 | 5.0.10 |
| `shadcn/ui` | UI 组件库 | - |
| `Prisma` | ORM 数据库操作 | 7.2.0 |
| `Next.js` | React 框架 | 16.1.1 |

---

## 📂 文件结构

```
app/
├── api/
│   ├── statistics/
│   │   ├── personal/route.ts        # 个人统计API
│   │   └── department/route.ts      # 部门统计API
│   ├── admin/
│   │   └── forms/
│   │       ├── route.ts             # 表单列表/创建
│   │       └── [id]/route.ts        # 表单详情/更新/删除
│   └── approvers/
│       ├── suggest/route.ts         # 审批人建议
│       └── search/route.ts          # 用户搜索
│
├── (dashboard)/
│   ├── statistics/
│   │   └── personal/page.tsx        # 个人统计页面
│   └── admin/
│       ├── forms/
│       │   ├── page.tsx             # 表单列表
│       │   ├── new/page.tsx         # 新建表单
│       │   └── [id]/edit/page.tsx   # 编辑表单
│       ├── statistics/
│       │   └── department/page.tsx  # 部门统计
│       └── approver-demo/page.tsx   # 审批人选择器演示
│
components/
├── form-designer/
│   ├── FieldLibrary.tsx             # 字段库
│   ├── DesignCanvas.tsx             # 画布
│   └── PropertyPanel.tsx            # 属性面板
│
└── approver-selector/
    └── ApproverSelector.tsx         # 审批人选择器

lib/
└── stores/
    └── form-designer-store.ts       # 表单设计器状态

prisma/
└── schema.prisma                    # 新增 FormTemplate, Statistics 表
```

---

## 🚀 使用指南

### 1. 查看个人统计
1. 登录系统
2. 点击侧边栏"个人统计"
3. 选择时间段（月度/年度）
4. 查看各项统计数据和图表

### 2. 创建自定义表单
1. 以管理员身份登录
2. 进入"系统管理" → "表单管理"
3. 点击"新建表单"
4. 填写表单基本信息（名称、编码、分类）
5. 从左侧字段库拖拽字段到画布
6. 点击字段，在右侧配置属性
7. 点击"保存"

### 3. 使用审批人选择器
1. 在需要选择审批人的地方引入组件
2. 设置 mode 为 "single" 或 "multiple"
3. 传入 selectedUserIds 和 onConfirm 回调
4. 用户可通过搜索、部门、岗位三种方式选择

---

## 🔧 后续优化建议

### 统计功能
- [ ] 添加定时任务，预计算统计数据
- [ ] 支持数据导出（CSV/Excel）
- [ ] 添加更多维度的统计分析

### 动态表单
- [ ] 添加表单预览功能
- [ ] 支持表单版本管理
- [ ] 实现动态表单渲染引擎（用于申请页面）
- [ ] 支持更多字段类型（富文本、评分、级联选择等）

### 审批人指派
- [ ] 集成到流程设计器中
- [ ] 支持会签/或签逻辑
- [ ] 添加审批人规则引擎（如：金额 > 5000 则需总经理审批）
- [ ] 支持审批人委托和代理

---

## 📝 注意事项

1. **权限控制**
   - 统计功能：所有用户可查看个人统计，仅管理员可查看部门统计
   - 表单管理：仅管理员可访问
   - 审批人选择：所有用户可使用

2. **数据安全**
   - 个人统计仅显示当前用户的数据
   - 部门统计需验证管理员权限
   - 用户搜索仅返回状态正常的用户

3. **性能优化**
   - 统计数据目前为实时计算，数据量大时可能较慢
   - 建议后续添加缓存或预计算机制
   - 用户搜索限制返回 50 条结果

---

## ✨ 完成状态

- ✅ 统计功能模块（个人统计、部门统计、图表可视化）
- ✅ 动态表单配置模块（表单设计器、表单管理、状态管理）
- ✅ 自定义审批人指派模块（审批人选择器、建议API、搜索API）

所有功能已完成基础实现，代码简洁，使用现有 shadcn 组件库，符合项目规范。
