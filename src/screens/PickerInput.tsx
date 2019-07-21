import React, { useMemo } from "react";
import { FieldMetaState } from "react-final-form";
import { Picker, Platform, StyleSheet } from "react-native";
import { HelperText, Text } from "react-native-paper";
import PickerSelect, { Item } from 'react-native-picker-select'

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
}) => {

  const items: Item[] = useMemo(() => options.map(([value, label]) => ({
    label,
    value
  })) , [options])
  
  return (
    <>
      <Text>{label}</Text>


      <PickerSelect
        items={items}
        onValueChange={input.onChange}
        value={input.value}
        style={{inputIOS: styles.picker}}
      />

      {meta.error && meta.touched && (
        <HelperText type='error'>{meta.error}</HelperText>
      )}
    </>
  );
}

export const createPicker = (options: Options[]) => 
  (props: any) => 
    <PickerInput {...props} options={options} />
    

    const styles = StyleSheet.create({
      picker: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
      },
    });
    