export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: Date | null;
  timeSpent: number;
  isTracking: boolean;
  startTime: number | null;
}

export interface Project {
  id: number;
  name: string;
  tasks: Task[];
}
