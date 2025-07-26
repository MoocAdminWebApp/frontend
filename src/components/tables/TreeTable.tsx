// src/components/tables/TreeTable.tsx
// This ant design based component will be used to render tree structure such as menus or categories in the future
// but currently there exists several issues during implmentation, so it is not used yet.

import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

// define the interface for the tree structure
export interface TreeTableProps<T> {
  data: T[]; // tree structure data
  columns: ColumnsType<T>;
  rowKey?: string;
  defaultExpandAll?: boolean; // default setting for expanding all rows
  loading?: boolean;
  expandable?: boolean; // whether the table is expandable
}

/**
 * TreeTable component for rendering a tree structure in a table format.
 */
function TreeTable<T extends object>({
  data,
  columns,
  rowKey = "id",
  defaultExpandAll = false,
  loading = false,
  expandable = true,
}: TreeTableProps<T>) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      pagination={false} // Disable pagination for tree table
      expandable={
        expandable
          ? {
              defaultExpandAllRows: defaultExpandAll,
            }
          : undefined
      }
    />
  );
}

export default TreeTable;
