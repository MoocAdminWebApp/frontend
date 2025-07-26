import React from "react";
import { useState } from "react";
import { Box } from "@mui/material";
import { Category } from "../../types/category";
import CategoryRow from "./categoryRow";
import { fetchChildrenCategories } from "../../request/category";

interface CategoryTreeProps {
  categories: Category[];
  level?: number;
  onViewCategory?: (category: Category) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, level = 0, onViewCategory }) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<number, Category[]>>({});

  const handleToggle = async (id: number) => {
    const isExpanded = expandedIds.includes(id);

    if (isExpanded) {
      setExpandedIds(expandedIds.filter((eid) => eid !== id));
    } else {
      setExpandedIds([...expandedIds, id]);

      if (!childrenMap[id]) {
        const data = await fetchChildrenCategories(id);
        setChildrenMap((prev) => ({
          ...prev,
          [id]: data,
        }));
      }
    }
  };
  return (
    <Box>
      {categories.map((category) => {
        const isExpanded = expandedIds.includes(category.id);
        // const hasChildren = childrenMap[category.id]?.length > 0 || !childrenMap[category.id];
        return (
          <React.Fragment key={category.id}>
            <CategoryRow
              category={category}
              level={level}
              onToggle={handleToggle}
              isExpanded={isExpanded}
              hasChildren={true}
              onViewCategory={onViewCategory}
            />
            {expandedIds.includes(category.id) && childrenMap[category.id] && (
              <CategoryTree categories={childrenMap[category.id]} level={(level ?? 0) + 1} onViewCategory={onViewCategory} />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default CategoryTree;
