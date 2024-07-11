"use client";
import React, { useState, KeyboardEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Trash2,
  Play,
  Pause,
  StopCircle,
} from "lucide-react";
import { priorityColors } from "@/const/const";
import { useProjectManagement } from "@/hooks/useProjectManagement";
import { formatDate, formatTime } from "@/lib/formatters";

const Home: React.FC = () => {
  const {
    filteredProjects,
    newProject,
    setNewProject,
    searchTerm,
    setSearchTerm,
    setFilterPriority,
    setFilterCompleted,
    openProjects,
    setOpenProjects,
    editingProjectId,
    setEditingProjectId,
    editingTaskId,
    editingTaskText,
    setEditingTaskText,
    newTask,
    setNewTask,
    addProject,
    editProject,
    deleteProject,
    addTask,
    toggleTask,
    deleteTask,
    startEditingTask,
    saveEditingTask,
    updateTaskPriority,
    toggleTimeTracking,
    stopTimeTracking,
    updateTaskDueDate,
    handleProjectKeyDown,
    handleTaskKeyDown,
  } = useProjectManagement();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">プロジェクト管理ツール</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          value={newProject}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewProject(e.target.value)
          }
          onKeyDown={handleProjectKeyDown}
          placeholder="新しいプロジェクト名を入力"
          className="flex-grow mr-2"
        />
        <Button onClick={addProject}>プロジェクト追加</Button>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          placeholder="タスクを検索"
          className="mb-2"
        />
        <div className="flex space-x-2">
          <Select onValueChange={setFilterPriority} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="優先度でフィルタ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全て</SelectItem>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setFilterCompleted} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="状態でフィルタ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全て</SelectItem>
              <SelectItem value="active">未完了</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Accordion
        type="multiple"
        value={openProjects}
        onValueChange={setOpenProjects}
        className="w-full"
      >
        {filteredProjects.map((project) => (
          <AccordionItem value={project.id.toString()} key={project.id}>
            <AccordionTrigger>
              {editingProjectId === project.id ? (
                <Input
                  type="text"
                  value={project.name}
                  onChange={(e) => editProject(project.id, e.target.value)}
                  onBlur={() => setEditingProjectId(null)}
                  autoFocus
                />
              ) : (
                <span onClick={() => setEditingProjectId(project.id)}>
                  {project.name}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
                className="ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex mb-4">
                <Input
                  type="text"
                  value={newTask}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTask(e.target.value)
                  }
                  onKeyDown={(e) => handleTaskKeyDown(e, project.id)}
                  placeholder="新しいタスクを入力"
                  className="flex-grow mr-2"
                />
                <Button onClick={() => addTask(project.id)}>タスク追加</Button>
              </div>
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
                      <Button
                        onClick={() => saveEditingTask(project.id)}
                        className="ml-2"
                      >
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Home;
