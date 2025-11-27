export const formatLocalDate = (date: Date | string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const safeDate = (value: any) => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};
