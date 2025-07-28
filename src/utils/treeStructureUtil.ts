import { MenuDto } from "../types/menu";
import { TreeModule, ExpandState } from "../types/enum";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { TreeNode, FlatNode, TreeModuleDtoMap } from "../types/types";

// create specific Map based on module
function createDtoMap<T extends keyof TreeModuleDtoMap>(
  module: T
): Map<number, TreeModuleDtoMap[T]> {
  return new Map<number, TreeModuleDtoMap[T]>();
}
function createDtoData<T extends keyof TreeModuleDtoMap>(
  module: T
): TreeModuleDtoMap[T][] {
  return [];
}

export function convertMenuDtoToTreeNode(menus: MenuDto[]): TreeNode[] {
  return menus.map((menu) => ({
    id: menu.id,
    title: menu.title,
    parentId: menu.parentId ?? null,
    children: convertMenuDtoToTreeNode(menu.children || []),
    raw: menu,
  }));
}

export function buildTreeFromFlatData(rawData: TreeNode[]): TreeNode[] {
  const idToNodeMap = new Map<number, TreeNode>(); // map of all the nodes
  const roots: TreeNode[] = []; // collection of all the parent nodes

  // init all the nodes and assign with empty children
  for (const item of rawData) {
    idToNodeMap.set(item.id, { ...item, children: [] });
  }

  // const parent-child relationships
  for (const item of rawData) {
    const node = idToNodeMap.get(item.id)!;
    if (item.parentId === null) {
      roots.push(node);
    } else {
      const parent = idToNodeMap.get(item.parentId);
      if (parent) {
        parent.children!.push(node);
      }
    }
  }

  return roots;
}

export function flattenTree(
  treeData: TreeNode[],
  parentId: number | null = null,
  level: number = 0
): FlatNode[] {
  const result: FlatNode[] = [];

  treeData.forEach((node, index) => {
    const expand =
      node.children && node.children.length > 0
        ? ExpandState.Collapsed
        : ExpandState.NonExpandable;
    const flatNode: FlatNode = {
      id: node.id,
      expandState: expand,
      title: node.title,
      parentId: parentId,
      level: level,
      orderNum: index,
    };

    result.push(flatNode);

    if (node.children && node.children.length > 0) {
      const childrenFlat = flattenTree(node.children, node.id, level + 1);
      result.push(...childrenFlat);
    }
  });

  return result;
}

export function flattenTreeWithExpand(
  nodes: TreeNode[],
  parentId: number | null = null,
  level: number = 0,
  expandMap: Record<number, ExpandState>
): FlatNode[] {
  const result: FlatNode[] = [];

  nodes.forEach((node, index) => {
    // Determine current node's expand state: If node has children, default to Collapsed; else NonExpandable (default)
    const hasChildren = node.children && node.children.length > 0;
    const state =
      expandMap[node.id] ??
      (hasChildren ? ExpandState.Collapsed : ExpandState.NonExpandable);

    const flatNode: FlatNode = {
      id: node.id,
      title: node.title,
      parentId,
      level,
      orderNum: index,
      expandState: state,
      raw: node.raw,
    };

    result.push(flatNode);

    /**
     * Recursively flatten children only if: The node is in Expanded state, and the node has children.
     * This part of code won't be executed when initializing the page (as all the nodes are defaultly set to Collapsed).
     * When the onToggleExpand(_id) is triggered, expandMap will be updated and then flattenTreeWithExpand() will be executed again,
     * and then the the child nodes of node(_id) will be flattened and rendered
     */
    if (state === ExpandState.Expanded && hasChildren) {
      const children = flattenTreeWithExpand(
        node.children!,
        node.id,
        level + 1,
        expandMap
      );
      result.push(...children);
    }
  });

  return result;
}
