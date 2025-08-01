import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Type Definitions
interface SummaryItem {
  label: string;
  value: number;
  color: string;
}

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

interface ProgressItem {
  name: string;
  value: number;
  color: string;
}

interface AverageCycleItem {
  name: string;
  days: number;
  color: string;
}

// Mock Data
const summaryData: SummaryItem[] = [
  { label: "Enrolled", value: 2340, color: "#00B2A9" },
  { label: "In Progress", value: 1782, color: "#FFA500" },
  { label: "Pending Review", value: 1596, color: "#FF9900" },
];

const courseStatusData: ChartItem[] = [
  { name: "Active", value: 400, color: "#00B2A9" },
  { name: "Draft", value: 500, color: "#008073" },
  { name: "Expired", value: 300, color: "#FF9900" },
  { name: "Cancelled", value: 150, color: "#C94A4A" },
];

const deadlineData: ChartItem[] = [
  { name: "Within 60 days", value: 400, color: "#00B2A9" },
  { name: "Within 30 days", value: 200, color: "#FF9900" },
  { name: "Expired", value: 150, color: "#FFD966" },
];

const categoryProgressData: ProgressItem[] = [
  { name: "Frontend", value: 70, color: "#00B2A9" },
  { name: "Backend", value: 25, color: "#FFD966" },
  { name: "DevOps", value: 50, color: "#F4A261" },
  { name: "Cloud", value: 65, color: "#2A9D8F" },
  { name: "AI", value: 12, color: "#C94A4A" },
  { name: "IoT", value: 10, color: "#457B9D" },
];

const averageCycleData: AverageCycleItem[] = [
  { name: "Frontend", days: 25, color: "#00B2A9" },
  { name: "Backend", days: 45, color: "#FFD966" },
  { name: "DevOps", days: 18, color: "#F4A261" },
  { name: "Cloud", days: 12, color: "#457B9D" },
];

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {summaryData.map((item) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ color: item.color }}>
                ● {item.label}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {item.value.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Charts Section */}
        <Grid item xs={12} md={6}>
          <Typography fontWeight={600} mb={1}>
            Courses by Status
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseStatusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {courseStatusData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight={600} mb={1}>
            Courses Near Deadline
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deadlineData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {deadlineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* Category Progress */}
        <Grid item xs={12} md={6}>
          <Typography fontWeight={600} mb={2}>
            Course by Category
          </Typography>
          {categoryProgressData.map((item) => (
            <Box key={item.name} mb={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>{item.name}</Typography>
                <Typography>{item.value}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#f0f0f0",
                  ".MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                  },
                }}
              />
            </Box>
          ))}
        </Grid>

        {/* Average Completion Time */}
        <Grid item xs={12} md={6}>
          <Typography fontWeight={600} mb={2}>
            Average Completion Time
          </Typography>
          <Grid container spacing={2}>
            {averageCycleData.map((item) => (
              <Grid item xs={6} key={item.name}>
                <Card sx={{ borderLeft: `6px solid ${item.color}` }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight={700}>
                      {item.days} <small>days</small>
                    </Typography>
                    <Typography color="textSecondary">{item.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
