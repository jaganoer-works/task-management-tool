import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setFilterPriority: (value: string) => void;
  setFilterCompleted: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  setFilterPriority,
  setFilterCompleted,
}) => (
  <div className="mb-4">
    <Input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
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
);

export default SearchAndFilter;
