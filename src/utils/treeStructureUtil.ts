import { MenuDto } from "../types/menu";
import { TreeModule, ExpandState } from "../types/enum";
import { TreeNode, FlatNode } from "../types/types";
import { iconMap } from "../types/icons";

// Helper function to convert the data returned from backend into general TreeNode[] type
// ATTENTION: Need to create separate functions for different return types correspondingly
export function convertMenuDtoToTreeNode(menus: MenuDto[]): TreeNode[] {
  return menus.map((menu) => ({
    id: menu.id,
    title: menu.title,
    parentId: menu.parentId ?? null,
    children: convertMenuDtoToTreeNode(menu.children || []),
    raw: menu,
  }));
}

// Helper function to construct tree structure from flat data
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

// Helper function to flatten tree data while retaining tree-structure information
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

// Helper function to construct tree structure from flat data for the sidebar
function assignIcon(iconKey: string | undefined): React.ElementType {
  if (iconKey && iconMap[iconKey]) return iconMap[iconKey];
  return iconMap["DefaultIcon"];
}

function updateMenuNodeInfo(nodes: MenuDto[], level = 0): MenuDto[] {
  return nodes.map((node) => {
    const newNode: MenuDto = {
      ...node,
      level,
      icon: level > 1 ? undefined : node.icon,
      children: node.children
        ? updateMenuNodeInfo(node.children, level + 1)
        : [],
    };
    return newNode;
  });
}

export function buildSidebarStructure(rawData: MenuDto[]): MenuDto[] {
  const idToNodeMap = new Map<number, MenuDto>(); // map of all the nodes
  const roots: MenuDto[] = []; // collection of all the parent nodes

  // init all the nodes and assign with empty children
  for (const item of rawData) {
    idToNodeMap.set(item.id, {
      ...item,
      children: [],
      level: 0,
      icon: assignIcon(item.icon as string),
    });
  }

  // const parent-child relationships
  for (const item of rawData) {
    const node = idToNodeMap.get(item.id)!;
    if (!item.parentId || item.parentId === null) {
      roots.push(node);
    } else {
      const parent = idToNodeMap.get(item.parentId);
      if (parent) {
        parent.children!.push(node);
      }
    }
  }
  const treeWithLevels = updateMenuNodeInfo(roots);
  return treeWithLevels;
}
