import { withNavigation, NavigationScreenProp, ScrollView } from "react-navigation";
import { NavigationRoute } from "react-navigation";
import usePlayer from "../hooks/use-player";
import { Form, Field } from "react-final-form";
import { FormTextInput } from "./FormTextInput";
import React, { useCallback } from "react";
import { Button } from "react-native-paper";
import { compose } from "redux";
import { useDispatch } from "react-redux";
import { updatePlayer, removePlayer } from "../redux/player";
import { Player } from "../types";
import { requiredValidator } from "../validators/requiredValidator";
import { Alert } from "react-native";

const nameValidator = compose(
  requiredValidator("Você deve informar o nome")
)

const EditPlayer = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute>
}) => {
  const peladaId: number = navigation.getParam('peladaId')
  const player = usePlayer(navigation.getParam('id'))
  const dispatch = useDispatch()

  const onSubmit = useCallback((player: Player) => {
    dispatch(updatePlayer(player))
    navigation.goBack()
  }, [])

  const onRemovePlayer = useCallback(() => {
    Alert.alert(
      "Remover jogador", "Tem certeza que quer remover?",
      [{
        text: "Sim",
        onPress: () => {
          dispatch(removePlayer(player!.id, peladaId))
          navigation.goBack()
        }
      }, {
        text: "Não"
      }]
    )
  }, [player])

  if (!player) {
    return null
  }
  
  return (
    <ScrollView>
      <Form
        onSubmit={onSubmit}
        initialValues={player}
        render={({ handleSubmit }) => (
          <>
            <Field
              name='name'
              label="Nome"
              component={FormTextInput}
              validate={nameValidator}
            />

            <Field
              name='availableToPlay'
              label="Disponível para sorteio"
              component={FormCheckBoxInput}
            />

            <Button
              onPress={() => handleSubmit()}
              mode='contained'
            >
              Atualizar jogador
            </Button>

            <Button
              color='red'
              onPress={onRemovePlayer}
            >
              Remover jogador
            </Button>
          </>
        )}
      />
    </ScrollView>
  )
}

export default withNavigation(EditPlayer)