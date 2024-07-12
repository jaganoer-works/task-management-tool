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
  Search,
} from "lucide-react";
import { priorityColors } from "@/const/const";
import { useProjectManagement } from "@/hooks/useProjectManagement";
import { formatDate, formatTime } from "@/lib/formatters";
import ProjectForm from "@/components/ProjectForm";
import SearchAndFilter from "@/components/SearchAndFilter";
import TaskForm from "@/components/TaskForm";

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
      <ProjectForm
        newProject={newProject}
        setNewProject={setNewProject}
        addProject={addProject}
        handleProjectKeyDown={handleProjectKeyDown}
      />
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setFilterPriority={setFilterPriority}
        setFilterCompleted={setFilterCompleted}
      />
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
              <TaskForm
                newTask={newTask}
                setNewTask={setNewTask}
                addTask={addTask}
                handleTaskKeyDown={handleTaskKeyDown}
                projectId={project.id}
              />
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
