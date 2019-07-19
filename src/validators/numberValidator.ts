export const numberValidator = (message: string = 'O valor deve ser numérico') => 
  (value: any): string | undefined => 
    isNaN(value) ? message : undefined;
