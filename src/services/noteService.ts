import axios from "axios";
import type { CreateNoteRequest, Note } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export interface NotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
}

export const fetchNotes = async (
  page: number = 1,
  searchKey: string = ""
): Promise<NotesResponse> => {
  const res = await axios.get<NotesResponse>(
    `/notes?search=${encodeURIComponent(
      searchKey
    )}&page=${page}&perPage=12&sortBy=created`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return res.data;
};

export const createNote = async (data: CreateNoteRequest) => {
  const res = await axios.post<Note>("/notes", data, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  const res = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};
