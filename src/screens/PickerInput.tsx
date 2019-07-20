import React from "react";
import { FieldMetaState } from "react-final-form";
import { Picker, Platform } from "react-native";
import { HelperText, Text } from "react-native-paper";

type Options = [any, string]

export const PickerInput = ({ 
  input, 
  label,
  options,
  meta 
}: {
  label?: string;
  input: any,
  meta: FieldMetaState<any>,
  options: Options[]
}) => (
  <>
    <Text>{label}</Text>
    <Picker
      selectedValue={input.value}
      onValueChange={input.onChange}
    >
      {options.map(([id, label]) => (
        <Picker.Item key={id} label={label} value={id} />
      ))}
    </Picker>

    {meta.error && meta.touched && (
      <HelperText type='error'>{meta.error}</HelperText>
    )}
  </>
);


export const createPicker = (options: Options[]) => 
  (props: any) => 
    <PickerInput {...props} options={options} />
    