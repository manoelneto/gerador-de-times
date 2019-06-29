import { View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { Form, Field } from 'react-final-form';
import { FormTextInput } from "./FormTextInput";
import { requiredValidator } from "../validators/requiredValidator";

const valueValidator = requiredValidator("Você deve informar um valor")

export const NewPeladaForm = ({ label, onSubmit }: {
  label: string;
  onSubmit: any;
}) => {
  return (
    <Form onSubmit={onSubmit} render={({ handleSubmit }) => (
      <>
        <Field
          name='name' 
          label={label} 
          component={FormTextInput}
          validate={valueValidator}
          />

        <Button onPress={handleSubmit}>
          Adicionar
        </Button>
      </>
    )} />
  );
};
