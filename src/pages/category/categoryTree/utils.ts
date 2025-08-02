import { Category, CategoryNode } from "../../../types/category";

const buildCategoryTree = (list: Category[]): CategoryNode[] => {
  const map = new Map<number, CategoryNode>();

  list.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  const roots: CategoryNode[] = [];

  map.forEach((node) => {
    if (node.parentId == null) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });
  return roots;
};

export default buildCategoryTree;