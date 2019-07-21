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
import { createPicker } from "./PickerInput";

const PeladaTeamPlayersCountPicker = createPicker([
  [1, "1"],
  [2, "2"],
  [3, "3"],
  [4, "4"],
  [5, "5"],
  [6, "6"],
  [7, "7"],
  [8, "8"],
  [9, "9"],
  [10, "10"],
])

const nameValidator = composeValidators(
  requiredValidator("Você deve informar o nome")
)

const teamPlayersCountValidator = composeValidators(
  requiredValidator("Você deve informar a quantidade de jogadores na linha")
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
              component={PeladaTeamPlayersCountPicker}
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