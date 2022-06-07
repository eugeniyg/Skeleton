export interface ValidationRuleInterface {
  id: number,
  rule: string,
  arguments: null|string,
}

export interface FieldInterface {
  id: number,
  name: string,
  description: string,
  editable: boolean,
  isRequired: boolean,
  value?: any,
  validationRules: ValidationRuleInterface[],
}
