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
  }));
}

function createTreeNode<T extends keyof TreeModuleDtoMap>(
  module: T,
  item: Partial<TreeModuleDtoMap[T]> = {}
): TreeModuleDtoMap[T] {
  switch (module) {
    case TreeModule.Menu:
      return { ...item, children: [] } as MenuDto;
    default:
      return { ...item, children: [] } as MenuDto;
  }
}

export const convertFlatToTree = (flatData: MenuDto[]) => {
  const map = createDtoMap(TreeModule.Menu);
  const treeData = createDtoData(TreeModule.Menu);
  // const map = new Map<number, MenuDto>(); // Create a map to hold the nodes by their ID
  // const treeData: MenuDto[] = []; // This will hold the final tree structure
  const expandableIds: string[] = [];

  // Create a map of all nodes
  flatData.forEach((item) => {
    // const node: MenuDto = {
    //   ...item,
    //   children: [],
    // };
    const node = createTreeNode(TreeModule.Menu, item);
    map.set(node.id, node); // Add the node to the map
  });

  // Build the tree structure
  flatData.forEach((item) => {
    const node = map.get(item.id);
    if (node) {
      if (item.parentId === null || item.parentId === undefined) {
        // If the node has no parent, it's a root node
        treeData.push(node);
      } else {
        // If it has a parent, find the parent and add this node to its children
        const parentNode = map.get(item.parentId);
        if (parentNode) {
          parentNode.children!.push(node); // Use non-null assertion since we know children is initialized
        }
      }
    }
  });

  // Sort the tree data, and collect expandable IDs
  const sortTreeAndFindExpandables = (nodes: MenuDto[]) => {
    nodes.sort((a, b) => a.orderNum - b.orderNum);
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        expandableIds.push(String(node.id));
        sortTreeAndFindExpandables(node.children);
      }
    });
  };

  sortTreeAndFindExpandables(treeData);
  return { items: treeData, expandables: expandableIds };
};

// export const toTreeViewItem = (node: MenuDto): TreeViewBaseItem => ({
//   id: String(node.id),
//   label: node.title,
//   children: node.children?.map(toTreeViewItem),
// });

export const toTreeViewItem = (node: MenuDto): TreeNode => ({
  id: node.id,
  title: node.title,
  parentId: node.parentId ? node.parentId : null,
  children: node.children?.map(toTreeViewItem),
});

// export const convertMenuDtoToTreeNode = (node: MenuDto): TreeNode => ({
//   id: node.id,
//   children: node.children?.map(convertMenuDtoToTreeNode),
// });

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

export const parseFlatData = (flatData: any[], module: number) => {
  const map = createDtoMap(module);
  const treeData = createDtoData(module);
  switch (module) {
    case TreeModule.Menu:
      flatData.forEach((item) => {
        const node = createTreeNode(TreeModule.Menu, item);
        map.set(node.id, node); // Add the node to the map
      });
      break;
    default:
      flatData.forEach((item) => {
        const node = createTreeNode(TreeModule.Menu, item);
        map.set(node.id, node); // Add the node to the map
      });
      break;
  }

  // Build the tree structure
};
