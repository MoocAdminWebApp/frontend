// src/components/tables/TreeViewTable.tsx

import React, { useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Chip, IconButton, Box } from "@mui/material";

import { convertDateFormat } from "../../utils/convertDateFormat";
import { ColumnType, CustomColumn, renderCellByType } from "./SimpleTable";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { TreeView, TreeItem } from "@mui/lab";

export interface TreeNode {
  id: number;
  [key: string]: any;
  children?: TreeNode[];
}

interface TreeTableProps {
  data: TreeNode[];
  columns: CustomColumn[];
  onEdit?: (row: TreeNode) => void;
  onDelete?: (row: TreeNode) => void;
}

interface TreeViewTableProps {
  items: TreeViewBaseItem[];
  // columns: CustomColumn[];
  isItemEditable?: boolean;
  defaultExpandedItems?: string[];
  expandedItems?: string[];
  onExpandedItemsChange?: (newExpanded: string[]) => void;
}

const TreeViewTable: React.FC<TreeViewTableProps> = ({
  items,
  // columns,
  isItemEditable = false,
  defaultExpandedItems = [],
}) => {
  // const gridColumns: GridColDef[] = columns.map((col) => ({
  //   field: col.field,
  //   headerName: col.headerName,
  //   width: col.width || 150,
  //   sortable: true,
  //   renderCell: renderCellByType(col.type || "text", col.field),
  // }));

  return (
    <RichTreeView items={items} defaultExpandedItems={defaultExpandedItems} />
  );
};

const TreeTableMUI: React.FC<TreeTableProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]); // 控制展开项

  // 用于包装渲染单元格所需的参数
  const createRenderCellParams = (row: TreeNode, field: string) => {
    return {
      row,
      value: row[field],
    } as any;
  };

  // 渲染每一行的数据（多列）
  const renderRow = (node: TreeNode) => (
    <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
      {columns.map((col) => {
        const renderFn = renderCellByType(
          col.type || "text",
          col.field,
          onEdit,
          onDelete
        );
        const cellContent = renderFn?.(createRenderCellParams(node, col.field));
        return (
          <Box
            key={col.field}
            sx={{
              width: col.width || 150,
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {cellContent}
          </Box>
        );
      })}
    </Box>
  );

  // 递归渲染 TreeItem 节点
  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <TreeItem
        key={node.id}
        nodeId={String(node.id)}
        label={renderRow(node)}
        collapseIcon={<KeyboardArrowDownIcon />}
        expandIcon={<KeyboardArrowRightIcon />}
      >
        {node.children && node.children.length > 0 && renderTree(node.children)}
      </TreeItem>
    ));
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      {/* 表头 */}
      <Box
        sx={{
          display: "flex",
          fontWeight: 600,
          px: 2,
          py: 1,
          borderBottom: "1px solid #ccc",
          bgcolor: "#f5f5f5",
        }}
      >
        {columns.map((col) => (
          <Box
            key={col.field}
            sx={{
              width: col.width || 150,
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {col.headerName}
          </Box>
        ))}
      </Box>

      {/* 树形结构内容 */}
      <TreeView
        defaultCollapseIcon={<KeyboardArrowDownIcon />}
        defaultExpandIcon={<KeyboardArrowRightIcon />}
        expanded={expanded}
        onNodeToggle={(_event: React.SyntheticEvent, nodeIds: string[]) =>
          setExpanded(nodeIds)
        }
        sx={{ px: 2 }}
      >
        {renderTree(data)}
      </TreeView>
    </Box>
  );
};

export default TreeTableMUI;
