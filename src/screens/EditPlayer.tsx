import React, { useCallback } from "react";
import { Field, Form } from "react-final-form";
import { Alert, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { NavigationRoute, NavigationScreenProp, ScrollView, withNavigation } from "react-navigation";
import { useDispatch } from "react-redux";
import usePlayer from "../hooks/use-player";
import { removePlayer, updatePlayer } from "../redux/player";
import { Player } from "../types";
import composeValidators from "../validators/composeValidators";
import { maxNumberValidator } from "../validators/maxNumberValidator";
import { minNumberValidator } from "../validators/minNumberValidator";
import { numberValidator } from "../validators/numberValidator";
import { requiredValidator } from "../validators/requiredValidator";
import { FormTextInput } from "./FormTextInput";
import { createPicker } from "./PickerInput";

const PlayerTypePicker = createPicker([
  ['goalkeeper', 'Goleiro'],
  ['defender', 'Zagueiro'],
  ['midfielder', 'Meio Campo'],
  ['forward', 'Atacante'],
])

const nameValidator = composeValidators(
  requiredValidator("Você deve informar o nome")
)

const typeValidator = composeValidators(
  requiredValidator("Você deve informar o tipo")
)

const starsValidator = composeValidators(
  requiredValidator("Você deve informar a quantidade de estrelas"),
  numberValidator(),
  minNumberValidator(1),
  maxNumberValidator(10),
)

const EditPlayer = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute>
}) => {
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
          dispatch(removePlayer(player!.id))
          navigation.goBack()
        }
      }, {
        text: "Não"
      }]
    )
  }, [player])

  const handleCancel = useCallback(() => {
    navigation.goBack()
  }, [])

  // quando o jogador é deletado, o player fica null
  if (!player) {
    return null
  }

  return (
    <ScrollView>
      <Form
        onSubmit={onSubmit}
        initialValues={player}
        render={({ handleSubmit, values: { type } }) => (
          <>
            <Field
              name='name'
              label="Nome"
              component={FormTextInput}
              validate={nameValidator}
            />

            <Field
              name='stars'
              label="Estrelas"
              component={FormTextInput}
              validate={starsValidator}
            />

            <Field
              name='type'
              label="Tipo"
              render={PlayerTypePicker}
              validate={typeValidator}
            />

            <Button
              onPress={handleSubmit}
              mode='contained'
              style={styles.updatePlayerButton}
            >
              Atualizar jogador
            </Button>

            <Button
              onPress={handleCancel}
              color='black'
            >
              Cancelar
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

const styles = StyleSheet.create({
  updatePlayerButton: {
    marginTop: 40
  }
})

export default withNavigation(EditPlayer)