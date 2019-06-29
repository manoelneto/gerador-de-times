export const requiredValidator = (message: string) => (value: any): string | undefined => !value ? message : undefined;
