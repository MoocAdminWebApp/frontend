import { MenuDto } from "../types/menu";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { TreeNode } from "../components/tables/TreeViewTable";

export const convertFlatToTree = (flatData: MenuDto[]) => {
  const map = new Map<number, MenuDto>(); // Create a map to hold the nodes by their ID
  const treeData: MenuDto[] = []; // This will hold the final tree structure
  const expandableIds: string[] = [];

  // Create a map of all nodes
  flatData.forEach((item) => {
    const node: MenuDto = {
      ...item,
      children: [],
    };
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

export const toTreeViewItem = (node: MenuDto): TreeViewBaseItem => ({
  id: String(node.id),
  label: node.title,
  children: node.children?.map(toTreeViewItem),
});

export const convertMenuDtoToTreeNode = (node: MenuDto): TreeNode => ({
  id: node.id,
  children: node.children?.map(convertMenuDtoToTreeNode),
});
