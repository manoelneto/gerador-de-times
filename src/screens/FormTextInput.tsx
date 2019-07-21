import React from "react";
import { TextInput, HelperText } from "react-native-paper";
import { FieldMetaState } from "react-final-form";
import { metaProperty } from "@babel/types";
import { Text, View, StyleSheet } from "react-native";
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
  <View
    style={styles.wrapper}
  >
    <TextInput
      {...input}
      value={input.value ? input.value.toString(): input.value}
      label={label}
      error={meta.error && meta.touched}
    />

    {meta.error && meta.touched && (
      <HelperText type='error'>{meta.error}</HelperText>
    )}
  </View>
);

// Eu acho que colocar magem no componente ta errado
// quem deve definir as margens é o component pai, onde
// ele pode alinhar os fields da forma que quiser
// mas vou deixar aqui por questões de simplicidade
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10
  }
})