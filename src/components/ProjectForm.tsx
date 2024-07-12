import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProjectFormProps {
  newProject: string;
  setNewProject: (value: string) => void;
  addProject: () => void;
  handleProjectKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  newProject,
  setNewProject,
  addProject,
  handleProjectKeyDown,
}) => (
  <div className="flex mb-4">
    <Input
      type="text"
      value={newProject}
      onChange={(e) => setNewProject(e.target.value)}
      onKeyDown={handleProjectKeyDown}
      placeholder="新しいプロジェクト名を入力"
      className="flex-grow mr-2"
    />
    <Button onClick={addProject}>プロジェクト追加</Button>
  </div>
);

export default ProjectForm;
