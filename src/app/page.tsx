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
  Trash2
} from "lucide-react";
import { useProjectManagement } from "@/hooks/useProjectManagement";
import ProjectForm from "@/components/ProjectForm";
import SearchAndFilter from "@/components/SearchAndFilter";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

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
              <TaskList
                project={project}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                startEditingTask={startEditingTask}
                saveEditingTask={saveEditingTask}
                updateTaskPriority={updateTaskPriority}
                updateTaskDueDate={updateTaskDueDate}
                toggleTimeTracking={toggleTimeTracking}
                stopTimeTracking={stopTimeTracking}
                editingTaskId={editingTaskId}
                editingTaskText={editingTaskText}
                setEditingTaskText={setEditingTaskText}
                handleTaskKeyDown={handleTaskKeyDown}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Home;
