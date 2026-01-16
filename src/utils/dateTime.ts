export const formatDateShort = (date: string | Date): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatSessionTime = (date: string | Date): string => {
  return `${formatDateShort(date)}, ${formatTime(date)}`;
};

export const minsToHours = (value: number): string => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}ч ${minutes}м`;
};
