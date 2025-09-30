import css from "./ErrorMessage.module.css";

interface Props {
  errorText: string;
}
const ErrorMessage = ({ errorText }: Props) => {
  return <p className={css.text}>{errorText}</p>;
};

export default ErrorMessage;
