import React from "react";
import { TextInput, HelperText } from "react-native-paper";
import { FieldMetaState } from "react-final-form";
import { metaProperty } from "@babel/types";
import { Text, View } from "react-native";
import { requiredValidator } from "../validators/requiredValidator";

export const FormTextInput = ({ 
  input, 
  label,
  meta 
}: {
  label?: string;
  input: any,
  meta: FieldMetaState<any>
}) => (
  <>
    <TextInput
      {...input}
      value={input.value ? input.value.toString(): input.value}
      label={label}
      error={meta.error && meta.touched}
    />

    {meta.error && meta.touched && (
      <HelperText type='error'>{meta.error}</HelperText>
    )}
  </>
);
