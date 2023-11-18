import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

const departmentStore = (set) => ({
  selectedDepartment: null,
  setSelectedDepartment: (data) => set({ selectedDepartment: data }),
});

const useDepartmentStore = create(
  devtools(
    persist(departmentStore, {
      name: 'Department',
    }),
  ),
);

export default useDepartmentStore;
