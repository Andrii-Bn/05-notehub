import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import css from "./App.module.css";
import { useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchKey, setsearchKey] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, searchKey],
    queryFn: () => fetchNotes(page, searchKey),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;
  const queryClient = useQueryClient();

  const handleNoteCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    closeModal();
  };

  const updateSearchKey = useDebouncedCallback((searchWord: string) => {
    setsearchKey(searchWord);
    setPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearchKey} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            updatePage={setPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isError && (
        <ErrorMessage errorText="There was an error, please try again..." />
      )}
      {isLoading && <Loader />}
      {isSuccess && <NoteList notes={data?.notes ?? []} />}
      {isSuccess && data?.notes.length === 0 && (
        <ErrorMessage errorText="You don`t have matching notes " />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} onSubmit={handleNoteCreated} />
        </Modal>
      )}
    </div>
  );
}
