export const minNumberValidator = (min: number) => 
  (value: any): string | undefined => 
    value < min ? `Não pode ser menor que ${min}` : undefined;
