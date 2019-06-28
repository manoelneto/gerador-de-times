import { Node } from "@babel/core";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { createBottomTabNavigator, FlatList, NavigationScreenProp, NavigationRoute, NavigationParams, withNavigation } from "react-navigation";
import { Card, Avatar, Title, Paragraph, Button, FAB, TextInput } from "react-native-paper";
import Pelada from "../types/Pelada";
import { Form, Field } from 'react-final-form'
import { string } from "prop-types";
import { useDispatch, useStore, useSelector } from "react-redux";
import { addPelada } from "../redux/pelada";
import { FormApi } from "final-form";
import { ApplicationState } from "../store";

const data: Pelada[] = [{
  name: "Pelada de Sábado",
  id: 1,
  players: []
}, {
  name: "Pelada de Sábado",
  id: 2,
  players: []
}, {
  name: "Pelada de Sábado",
  id: 3,
  players: []
}, {
  name: "Pelada de Sábado",
  id: 4,
  players: []
}, {
  name: "Pelada de Sábado",
  id: 5,
  players: []
}, {
  name: "Pelada de Sábado",
  id: 6,
  players: []
}]

const PeladaCard = ({
  pelada,
  navigation
}: {
  pelada: Pelada,
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
}) => (
  <Card
    onPress={() => navigation.navigate('pelada', { id: pelada.id, title: pelada.name })}
    style={styles.pelada}
  >
    <Card.Title title={pelada.name} subtitle={pelada.name + " sub"} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
)

const PeladaCardEnhanced = withNavigation(PeladaCard)

const FormTextInput = ({
  input,
  label
}: {
  label?: string
  input: any
}) => (
  <TextInput
    style={{ flex: 1 }}
    {...input}
    label={label}
  />
)

const NewPeladaForm = () => {
  const dispatch = useDispatch()

  return (
    <Form
      onSubmit={(
        { name } :
        { name: string },
        form
      ) => {
        if (name) {
          dispatch(
            addPelada(name)
          )
          setTimeout(() => form.reset(), 100)
        }
      }}
      render={({ handleSubmit }) => (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Field
            name='name'
            label="Nome da pelada"
            component={FormTextInput}
          />

          <Button
            onPress={handleSubmit}
          >
            Ok
          </Button>
        </View>
      )}
    />
  )
}

// const NewPeladaForm = () => {
//   return (
//     <Form
//       render={({ handleSubmit }) => (
//         <Field<string>
//           name='name'
//           component={FormTextInput}
//         />
//       )}
//     />
//   )
// }

const Home = (): JSX.Element => {
  const peladas: Pelada[] = useSelector(
    useCallback(
      (store: ApplicationState) => store.pelada,
      []
    )
  )

  return (
    <FlatList<Pelada>
      contentContainerStyle={styles.contentContainerStyle}
      ListHeaderComponent={NewPeladaForm}
      style={styles.homeStyle}
      data={peladas}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <PeladaCardEnhanced pelada={item} />}
    />
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 10,
    paddingBottom: 0
  },
  homeStyle: {
    backgroundColor: '#f5f5f5'
  },
  pelada: {
    marginBottom: 10
  }
})

export default Home