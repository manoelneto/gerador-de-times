export const maxNumberValidator = (max: number) => 
  (value: any): string | undefined => 
    value > max ? `Não pode ser maior que ${max}` : undefined;
