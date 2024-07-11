import { useState, useEffect } from "react";
import { Project, Task } from "@/types";

export const useProjectManagement = () => {
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

  // プロジェクトとタスクの操作関数をここに実装
  // addProject, editProject, deleteProject, addTask, toggleTask, deleteTask, etc.

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

  const handleProjectKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addProject();
    }
  };

  const handleTaskKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
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

  return {
    projects,
    setProjects,
    newProject,
    setNewProject,
    newTask,
    setNewTask,
    openProjects,
    setOpenProjects,
    editingProjectId,
    setEditingProjectId,
    editingTaskId,
    setEditingTaskId,
    editingTaskText,
    setEditingTaskText,
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    filterCompleted,
    setFilterCompleted,
    filteredProjects,
    addProject,
    editProject,
    deleteProject,
    addTask,
    toggleTask,
    deleteTask,
    startEditingTask,
    saveEditingTask,
    updateTaskPriority,
    updateTaskDueDate,
    toggleTimeTracking,
    stopTimeTracking,
    handleProjectKeyDown,
    handleTaskKeyDown,
  };
};
