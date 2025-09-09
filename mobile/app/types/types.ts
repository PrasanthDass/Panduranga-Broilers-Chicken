export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ComponentType<any>;
  disabled?: boolean;
}

export interface DropdownProps<T = DropdownItem> {
  label: string;
  data: T[];
  onSelect: (item: T) => void;
}
