export interface IField extends Record<string, any> {
  id: number;
  name: string;
  description: string;
  editable: boolean;
  isRequired: boolean;
  isVisible: boolean;
  position: number;
  value?: any;
}
