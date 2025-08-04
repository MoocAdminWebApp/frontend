import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { get } from "../../request/axios";
import { CourseDto } from "../../types/course";
import ChapterPage from "./ChapterPage";

const ChapterMasterPage: React.FC = () => {
  const [courseList, setCourseList] = useState<CourseDto[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      const resp = await get<CourseDto[]>("/courses"); // 后端接口需支持
      if (resp.isSuccess && resp.data) {
        setCourseList(resp.data);
        setSelectedCourseId(resp.data[0]?.id ?? null); // 默认选中第一个
      }
    };
    loadCourses();
  }, []);

  return (
    <Box>
      <h2>Chapter Management</h2>
      <Box display="flex" height="100%">
        <Box width={200} borderRight="1px solid #eee" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Courses
          </Typography>
          <Divider />
          <List>
            {courseList.map((course) => (
              <ListItemButton
                key={course.id}
                selected={course.id === selectedCourseId}
                onClick={() => setSelectedCourseId(course.id)}
              >
                <ListItemText primary={course.courseName} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box flex={1} overflow="auto" sx={{ minWidth: 0, width: "100%" }}>
          {selectedCourseId ? (
            <ChapterPage courseId={selectedCourseId} />
          ) : (
            <Typography sx={{ m: 4 }}>No course selected.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChapterMasterPage;
