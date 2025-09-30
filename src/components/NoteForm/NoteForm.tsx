import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateNoteRequest } from "../../types/note";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";

interface NoteFormProps {
  onClose: () => void;
  onSubmit?: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

export default function NoteForm({ onClose, onSubmit }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: CreateNoteRequest) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (onSubmit) onSubmit();
      onClose();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const defaultValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = (
    values: NoteFormValues,
    { setSubmitting, resetForm }: FormikHelpers<NoteFormValues>
  ) => {
    mutation.mutate(values, {
      onSettled: () => {
        setSubmitting(false);
        resetForm();
      },
    });
  };

  const OrderSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be at most 50 characters")
      .required("Title is required"),
    content: Yup.string().max(500, "Content must be at most 500 characters"),
    tag: Yup.string()
      .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
      .required("Tag is required"),
  });

  return (
    <Formik
      initialValues={defaultValues}
      onSubmit={handleSubmit}
      validationSchema={OrderSchema}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage component="span" name="title" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              component="span"
              name="content"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage component="span" name="tag" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              onClick={onClose}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
