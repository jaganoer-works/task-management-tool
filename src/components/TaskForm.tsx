import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: (projectId: number) => void;
  handleTaskKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    projectId: number
  ) => void;
  projectId: number;
}

const TaskForm: React.FC<TaskFormProps> = ({
  newTask,
  setNewTask,
  addTask,
  handleTaskKeyDown,
  projectId,
}) => (
  <div className="flex mb-4">
    <Input
      type="text"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
      onKeyDown={(e) => handleTaskKeyDown(e, projectId)}
      placeholder="新しいタスクを入力"
      className="flex-grow mr-2"
    />
    <Button onClick={() => addTask(projectId)}>タスク追加</Button>
  </div>
);

export default TaskForm;
