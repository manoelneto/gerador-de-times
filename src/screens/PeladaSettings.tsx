import React, { useCallback } from "react";
import { Field, Form } from "react-final-form";
import { Alert } from "react-native";
import { Button } from "react-native-paper";
import { NavigationRoute, NavigationScreenProp, ScrollView, withNavigation } from "react-navigation";
import { useDispatch } from "react-redux";
import usePelada from "../hooks/usePelada";
import { removePelada, updatePelada } from "../redux/pelada";
import { Pelada } from "../types";
import composeValidators from "../validators/composeValidators";
import { requiredValidator } from "../validators/requiredValidator";
import { FormTextInput } from "./FormTextInput";
import { numberValidator } from "../validators/numberValidator";
import { minNumberValidator } from "../validators/minNumberValidator";
import { maxNumberValidator } from "../validators/maxNumberValidator";

const nameValidator = composeValidators(
  requiredValidator("Você deve informar o nome")
)

const teamPlayersCountValidator = composeValidators(
  requiredValidator("Você deve informar a quantidade de jogadores na linha"),
  numberValidator(),
  minNumberValidator(1),
  maxNumberValidator(10),
)

const PeladaSettings = ({
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

            <Field
              name='teamPlayersCount'
              label="Quantidade de jogadores na linha"
              component={FormTextInput}
              validate={teamPlayersCountValidator}
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

export default withNavigation(PeladaSettings)