# 🧩 树形表格模块使用说明

## 📁 目录结构

```
/src
  ├── components/
  │   ├── pages/module/
  │   │   └── index.tsx         <-- 页面入口
  │   └── tables/
  │       ├── SimpleTable.tsx   <-- 表格组件基础渲染逻辑
  │       ├── PaginatedTable.tsx<-- 带分页通用表格封装
  │       └── TreeTable.tsx     <-- 支持嵌套层级的树形结构表格
  ├── utils/
  │   └── treeStructureUtils.ts <-- 树形结构构建/扁平化工具函数
  └── types/
      └── types.ts              <-- 类型定义：TreeNode、FlatNode 等
```

## 📌 类型说明

### `TreeNode`

```ts
export interface TreeNode {
  id: number;
  title: string;
  parentId: number | null;
  children?: TreeNode[];
  raw?: any; // 原始数据，如 MenuDto / ChapterDto 等
}
```

### `FlatNode`

```ts
export interface FlatNode {
  id: number;
  title: string;
  parentId: number | null;
  level: number;
  orderNum: number;
  expandState: number; // ExpandState 枚举值
  raw?: any; // 保留原始数据以供渲染其他字段
}
```

## 🧱 表格组件结构

### 1. `SimpleTable.tsx`

> 所有表格组件的基础实现，负责通用表格布局与单元格渲染。

支持的字段类型 `ColumnType`：

- `"text"`：普通文字
- `"chip"`：状态标签（如 status/type）
- `"action"`：编辑、删除按钮
- `"expand"`：树结构节点展开控制

### 2. `PaginatedTable.tsx`

> 封装带分页的通用表格（基于 `SimpleTable`）

**用于列表结构（非树形）展示**

```tsx
<PaginatedTable rows={data} columns={columns} />
```

**注意事项**：

- 不传 `expandMap`、`onToggleExpand`
- 不渲染展开按钮

### 3. `TreeTable.tsx`

> 树形结构的表格组件（基于 `SimpleTable`）

```tsx
<TreeTable
  rows={flatData}
  columns={columns}
  expandMap={expandMap}
  onToggleExpand={handleToggleExpand}
  expandable={true}
/>
```

**注意事项**：

- `rows` 应为 `FlatNode[]`，由 `flattenTreeWithExpand()` 生成
- `expandMap` 控制每个节点的展开/收起状态
- 需要手动传入 `expandable=true`，以启用缩进图标渲染

## 🛠 工具函数 `treeStructureUtils.ts`

| 函数名                       | 用途                               |
| ---------------------------- | ---------------------------------- |
| `convertMenuDtoToTreeNode()` | MenuDto[] → TreeNode[]             |
| `buildTreeFromFlatData()`    | 构建嵌套结构 TreeNode[]            |
| `flattenTree()`              | 树结构 → 完全展开 FlatNode[]       |
| `flattenTreeWithExpand()`    | 树结构 → 按展开状态生成 FlatNode[] |

## ✅ 如何在页面使用 TreeTable

### Step 1：初始化状态

```ts
const [treeData, setTreeData] = useState<TreeNode[]>([]);
const [expandMap, setExpandMap] = useState<Record<number, ExpandState>>({});
```

### Step 2：获取并转换数据

```ts
const raw = convertMenuDtoToTreeNode(resp.data.items);
const builtTree = buildTreeFromFlatData(raw);
setTreeData(builtTree);
```

### Step 3：初始化展开状态

```ts
useEffect(() => {
  const map: Record<number, ExpandState> = {};
  const walk = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      map[node.id] = node.children?.length
        ? ExpandState.Collapsed
        : ExpandState.NonExpandable;
      if (node.children?.length) walk(node.children);
    });
  };
  if (treeData.length) {
    walk(treeData);
    setExpandMap(map);
  }
}, [treeData]);
```

### Step 4：生成渲染数据

```ts
const dispData = useMemo(
  () => flattenTreeWithExpand(treeData, null, 0, expandMap),
  [treeData, expandMap]
);
```

### Step 5：渲染组件

```tsx
<TreeTable
  rows={dispData}
  columns={columns}
  expandMap={expandMap}
  onToggleExpand={handleToggleExpand}
  expandable
/>
```

## 📎 总结

| 组件             | 用途             | 数据格式   | 支持展开 |
| ---------------- | ---------------- | ---------- | -------- |
| `SimpleTable`    | 通用表格渲染     | 任意数组   | ❌       |
| `PaginatedTable` | 通用分页表格     | 普通数组   | ❌       |
| `TreeTable`      | 展示嵌套层级结构 | FlatNode[] | ✅       |

如需进一步扩展支持章节结构、课程结构等，只需保证：

- `TreeNode.raw` 保留完整原始字段
- 在 `renderCellByType` 中访问 `params.row.raw.xxx` 即可展示特定字段
