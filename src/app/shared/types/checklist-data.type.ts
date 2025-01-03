export type ChecklistData = {
  id: string;
  name: string;
  category: string;
  description: string;
  setLimitDate: boolean;
  setColor: boolean;
  setMessage?: boolean,
  limitDate: Date | null;
  backgroundColor: string;
  borderShadowColor: string;
  textColor: string;
  checklistItems: { label: string; checked: boolean }[];
  userUid?: string;
};
