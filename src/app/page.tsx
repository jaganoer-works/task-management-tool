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
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Trash2,
  Play,
  Pause,
  StopCircle,
} from "lucide-react";
import { Project, Task } from "@/types";
import { priorityColors } from "@/const/const";


const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<string>("");
  const [newTask, setNewTask] = useState<string>("");
  const [openProjects, setOpenProjects] = useState<string[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCompleted, setFilterCompleted] = useState<string>("all");

  const addProject = (): void => {
    if (newProject.trim() !== "") {
      const newProjectId = Date.now();
      setProjects([
        ...projects,
        { id: newProjectId, name: newProject, tasks: [] },
      ]);
      setNewProject("");
      setOpenProjects([...openProjects, newProjectId.toString()]);
    }
  };

  const editProject = (projectId: number, newName: string): void => {
    setProjects(
      projects.map((project) =>
        project.id === projectId ? { ...project, name: newName } : project
      )
    );
    setEditingProjectId(null);
  };

  const deleteProject = (projectId: number): void => {
    setProjects(projects.filter((project) => project.id !== projectId));
    setOpenProjects(openProjects.filter((id) => id !== projectId.toString()));
  };

  const addTask = (projectId: number): void => {
    if (newTask.trim() !== "") {
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: [
                  ...project.tasks,
                  {
                    id: Date.now(),
                    text: newTask,
                    completed: false,
                    priority: "medium",
                    dueDate: null,
                    timeSpent: 0,
                    isTracking: false,
                    startTime: null,
                  },
                ],
              }
            : project
        )
      );
      setNewTask("");
    }
  };

  const toggleTask = (projectId: number, taskId: number): void => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : project
      )
    );
  };

  const deleteTask = (projectId: number, taskId: number): void => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      )
    );
  };

  const startEditingTask = (task: Task): void => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const saveEditingTask = (projectId: number): void => {
    if (editingTaskId !== null) {
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === editingTaskId
                    ? { ...task, text: editingTaskText }
                    : task
                ),
              }
            : project
        )
      );
      setEditingTaskId(null);
      setEditingTaskText("");
    }
  };

  const updateTaskPriority = (
    projectId: number,
    taskId: number,
    priority: "low" | "medium" | "high"
  ): void => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, priority } : task
              ),
            }
          : project
      )
    );
  };

  const updateTaskDueDate = (
    projectId: number,
    taskId: number,
    dueDate: Date | null
  ): void => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, dueDate } : task
              ),
            }
          : project
      )
    );
  };

  const toggleTimeTracking = (projectId: number, taskId: number): void => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? task.isTracking
                    ? {
                        ...task,
                        isTracking: false,
                        timeSpent:
                          task.timeSpent +
                          (Date.now() - (task.startTime || 0)) / 1000,
                        startTime: null,
                      }
                    : { ...task, isTracking: true, startTime: Date.now() }
                  : task
              ),
            }
          : project
      )
    );
  };

  const stopTimeTracking = (projectId: number, taskId: number): void => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      isTracking: false,
                      timeSpent:
                        task.timeSpent +
                        (Date.now() - (task.startTime || 0)) / 1000,
                      startTime: null,
                    }
                  : task
              ),
            }
          : project
      )
    );
  };

  const handleProjectKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addProject();
    }
  };

  const handleTaskKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    projectId: number
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingTaskId !== null) {
        saveEditingTask(projectId);
      } else {
        addTask(projectId);
      }
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return format(date, "yyyy/MM/dd (EE)", { locale: ja });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProjects((prevProjects) =>
        prevProjects.map((project) => ({
          ...project,
          tasks: project.tasks.map((task) =>
            task.isTracking && task.startTime
              ? {
                  ...task,
                  timeSpent:
                    task.timeSpent + (Date.now() - task.startTime) / 1000,
                  startTime: Date.now(),
                }
              : task
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredProjects = projects.map((project) => ({
    ...project,
    tasks: project.tasks.filter((task) => {
      const matchesSearch = task.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      const matchesCompleted =
        filterCompleted === "all" ||
        (filterCompleted === "completed" && task.completed) ||
        (filterCompleted === "active" && !task.completed);
      return matchesSearch && matchesPriority && matchesCompleted;
    }),
  }));

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
