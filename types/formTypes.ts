export interface validationRuleInterface {
  id: number,
  rule: string,
  arguments: null|string,
}

export interface fieldInterface {
  id: number,
  name: string,
  description: string,
  editable: boolean,
  isRequired: boolean,
  validationRules: validationRuleInterface[],
}
