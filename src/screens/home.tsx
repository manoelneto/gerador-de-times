import { Node } from "@babel/core";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { createBottomTabNavigator, FlatList, NavigationScreenProp, NavigationRoute, NavigationParams, withNavigation } from "react-navigation";
import { Card, Avatar, Title, Paragraph, Button, FAB, List, TouchableRipple } from "react-native-paper";
import { string } from "prop-types";
import { useDispatch, useStore, useSelector } from "react-redux";
import { addPelada } from "../redux/pelada";
import { FormApi } from "final-form";
import { ApplicationState } from "../store";
import { ActionCreator, Action } from "redux";
import { Pelada } from "../types";
import _ from "lodash";
import { usePlayers } from "./pelada";
import { NewPeladaForm } from "./NewPeladaForm";

const PeladaListItem = ({
  pelada,
  navigation
}: {
  pelada: Pelada,
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
}) => {
  const players = usePlayers(pelada.id)
  

  return (
    <List.Item
      onPress={() => navigation.navigate('pelada', { id: pelada.id, title: pelada.name })}
      title={pelada.name}
      description={`Jogadores ${players.length}`}
      right={() => (
        <View style={{ justifyContent: 'center' }}>
          <List.Icon icon='keyboard-arrow-right' color="blue" />
        </View>
      )}
    />
  )
}

const PeladaListItemEnhanced = withNavigation(PeladaListItem)

const Home = () => {
  const peladas: Pelada[] = useSelector(
    useCallback(
      (store: ApplicationState) => _.values(store.pelada),
      []
    )
  )

  const dispatch = useDispatch()

  const onSubmit = useCallback((
    { name } :
    { name: string },
    form: FormApi
  ) => {
    if (name) {
      dispatch(
        addPelada(name)
      )
      setTimeout(() => form.reset(), 100)
    }
  }, [])

  return (
    <FlatList
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.contentContainerStyle}
      ListHeaderComponent={
        <NewPeladaForm
          label='Nome da pelada'
          buttonText='Adicionar Pelada'
          onSubmit={onSubmit}
        />
      }
      data={peladas}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <PeladaListItemEnhanced pelada={item} />}
    />
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {
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