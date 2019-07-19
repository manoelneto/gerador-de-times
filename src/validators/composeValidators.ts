type arg = any
type validators = (value?: arg) => string | undefined

const composeValidators = (...validators: validators[]) => (...args: arg[]) =>
  validators.reduce(
    (error: (string | undefined), validator) => error || validator(...args),
    undefined
  );

export default composeValidators;
