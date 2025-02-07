import { create } from "zustand";

interface PageProps {
  id: string;
  data: string;
}

interface PageInterface {
  curr_active_page: string;


  // get_all_pages
  get_active_page: (id: string) => PageProps | null;
  set_change_page: (id: string) => void;
  create_newPage: (id: string, val: PageProps) => void;
}

const usePage = create<PageInterface>((set) => ({
  curr_active_page: "page:page",


  get_active_page: (id) => {
    const storedPage = localStorage.getItem(id);
    return storedPage ? JSON.parse(storedPage) : null;
  },
  create_newPage: (id, val) => {
    localStorage.setItem(id, JSON.stringify(val))
  },
  set_change_page: (v) => set({ curr_active_page: v })
}))

export { usePage }
