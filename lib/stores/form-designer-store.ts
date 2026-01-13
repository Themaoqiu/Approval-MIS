import { create } from "zustand";

export type FieldType = "text" | "number" | "select" | "date" | "daterange" | "textarea" | "checkbox";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormSchema {
  fields: FormField[];
}

interface FormDesignerStore {
  fields: FormField[];
  selectedFieldId: string | null;
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  setSelectedField: (id: string | null) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  loadSchema: (schema: FormSchema) => void;
  clearFields: () => void;
}

export const useFormDesignerStore = create<FormDesignerStore>((set) => ({
  fields: [],
  selectedFieldId: null,

  addField: (field) =>
    set((state) => ({
      fields: [...state.fields, field],
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
      selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
    })),

  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  setSelectedField: (id) => set({ selectedFieldId: id }),

  reorderFields: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.fields);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { fields: result };
    }),

  loadSchema: (schema) =>
    set({
      fields: schema.fields,
      selectedFieldId: null,
    }),

  clearFields: () =>
    set({
      fields: [],
      selectedFieldId: null,
    }),
}));
