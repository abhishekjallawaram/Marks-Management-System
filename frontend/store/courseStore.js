import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

const courseStore = (set) => ({
  selectedCoures: null,
  setSelectedCourse: (data) => set({ selectedCoures: data }),
  selectedStudent: null,
  setSelectedStudent: (data) => set({ selectedStudent: data }),
});

const useCourseStore = create(
  devtools(
    persist(courseStore, {
      name: 'Course',
    }),
  ),
);

export default useCourseStore;
