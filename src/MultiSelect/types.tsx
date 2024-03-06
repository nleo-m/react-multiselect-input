type Callback = () => void;

export interface IMultiselect {
  fieldName: string;
  options: Array<{
    label: string;
    value: string;
    color: string | null;
  }>;
  defaultSelection: Array<{
    label: string;
    value: string;
    color: string | null;
  }>;
}
