import { FormAlert } from "./FormAlert";

export interface FormAlertListProps {
  error: any[];
}

export function FormAlertList(props: FormAlertListProps) {
  const { error } = props;
  const errorNode = error.map((e, i) => <FormAlert key={i} error={e} />);
  return <div className="space-y-2">{errorNode}</div>;
}
