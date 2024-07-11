import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return format(date, "yyyy/MM/dd (EE)", { locale: ja });
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
