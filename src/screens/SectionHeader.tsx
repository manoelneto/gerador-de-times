import React from "react";
import { SectionListData, StyleSheet } from "react-native";
import { Text } from 'react-native-paper';

export const styles = StyleSheet.create({
  section: {
    fontWeight: 'bold',
    backgroundColor: 'black',
    color: 'white',
    padding: 3
  }
})

export const SectionHeader = (
  { section } :
  {
    section: SectionListData<any>
  }
) => (
  <Text style={styles.section}>{section.title}</Text>
)
