import React from "react";
import { Project, Task } from "@/types/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { CalendarIcon, Pause, Play, StopCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { priorityColors } from "@/const/const";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { formatDate, formatTime } from "@/lib/formatters";

interface TaskListProps {
  project: Project;
  toggleTask: (projectId: number, taskId: number) => void;
  deleteTask: (projectId: number, taskId: number) => void;
  startEditingTask: (task: Task) => void;
  saveEditingTask: (projectId: number) => void;
  updateTaskPriority: (
    projectId: number,
    taskId: number,
    priority: "low" | "medium" | "high"
  ) => void;
  updateTaskDueDate: (
    projectId: number,
    taskId: number,
    date: Date | null
  ) => void;
  toggleTimeTracking: (projectId: number, taskId: number) => void;
  stopTimeTracking: (projectId: number, taskId: number) => void;
  editingTaskId: number | null;
  editingTaskText: string;
  setEditingTaskText: (value: string) => void;
  handleTaskKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    projectId: number
  ) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  project,
  editingTaskId,
  editingTaskText,
  toggleTask,
  deleteTask,
  startEditingTask,
  saveEditingTask,
  updateTaskPriority,
  updateTaskDueDate,
  toggleTimeTracking,
  stopTimeTracking,
  setEditingTaskText,
  handleTaskKeyDown,
}) => (
  <ul>
    {project.tasks.map((task) => (
      <li
        key={task.id}
        className={`flex items-center mb-2 p-2 rounded ${
          priorityColors[task.priority]
        }`}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(project.id, task.id)}
          className="mr-2"
        />
        {editingTaskId === task.id ? (
          <Input
            type="text"
            value={editingTaskText}
            onChange={(e) => setEditingTaskText(e.target.value)}
            onKeyDown={(e) => handleTaskKeyDown(e, project.id)}
            className="flex-grow mr-2"
            autoFocus
          />
        ) : (
          <span
            className={`flex-grow ${
              task.completed ? "line-through" : ""
            } cursor-pointer`}
            onClick={() => startEditingTask(task)}
          >
            {task.text}
          </span>
        )}
        <Select
          onValueChange={(value) =>
            updateTaskPriority(
              project.id,
              task.id,
              value as "low" | "medium" | "high"
            )
          }
          defaultValue={task.priority}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="優先度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {task.dueDate ? (
                formatDate(task.dueDate)
              ) : (
                <span>期限を設定</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={task.dueDate || undefined}
              onSelect={(date: Date | undefined) =>
                updateTaskDueDate(project.id, task.id, date || null)
              }
              initialFocus
              className="rounded-md border bg-white"
            />
          </PopoverContent>
        </Popover>
        <div className="ml-2 flex items-center">
          <span className="mr-2">{formatTime(task.timeSpent)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleTimeTracking(project.id, task.id)}
          >
            {task.isTracking ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => stopTimeTracking(project.id, task.id)}
          >
            <StopCircle className="h-4 w-4" />
          </Button>
        </div>
        {editingTaskId === task.id ? (
          <Button onClick={() => saveEditingTask(project.id)} className="ml-2">
            保存
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTask(project.id, task.id)}
            className="ml-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </li>
    ))}
  </ul>
);

export default TaskList;
