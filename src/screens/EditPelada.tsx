import { withNavigation, NavigationScreenProp, ScrollView } from "react-navigation";
import { NavigationRoute } from "react-navigation";
import usePlayer from "../hooks/use-player";
import { Form, Field } from "react-final-form";
import { FormTextInput } from "./FormTextInput";
import React, { useCallback } from "react";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { updatePlayer, removePlayer } from "../redux/player";
import { Player, Pelada } from "../types";
import { requiredValidator } from "../validators/requiredValidator";
import { Alert } from "react-native";
import usePelada from "../hooks/usePelada";
import { updatePelada, removePelada } from "../redux/pelada";
import composeValidators from "../validators/composeValidators";

const nameValidator = composeValidators(
  requiredValidator("Você deve informar o nome")
)

const EditPlayer = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute>
}) => {
  const pelada = usePelada(navigation.getParam('id'))!
  const dispatch = useDispatch()

  const onSubmit = useCallback((pelada: Pelada) => {
    dispatch(updatePelada(pelada))
    navigation.goBack()
  }, [])

  const onRemove = useCallback(() => {
    Alert.alert(
      "Remover pelada", 
      "Tem certeza? Essa ação não pode ser desfeita",
      [{
        text: "Sim",
        onPress: () => {
          dispatch(removePelada(pelada.id))
          navigation.goBack()
        }
      }, {
        text: "Não"
      }]
    )
  }, [pelada])
  
  return (
    <ScrollView>
      <Form
        onSubmit={onSubmit}
        initialValues={pelada}
        render={({ handleSubmit }) => (
          <>
            <Field
              name='name'
              label="Nome"
              component={FormTextInput}
              validate={nameValidator}
            />

            <Button
              onPress={() => handleSubmit()}
              mode='contained'
            >
              Atualizar pelada
            </Button>

            <Button
              color='red'
              onPress={onRemove}
            >
              Remover pelada
            </Button>
          </>
        )}
      />
    </ScrollView>
  )
}

export default withNavigation(EditPlayer)