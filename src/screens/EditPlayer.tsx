import { withNavigation, NavigationScreenProp, ScrollView } from "react-navigation";
import { NavigationRoute } from "react-navigation";
import usePlayer from "../hooks/use-player";
import { Form, Field } from "react-final-form";
import { FormTextInput } from "./Home";
import React, { useCallback } from "react";
import { Button } from "react-native-paper";
import { compose } from "redux";
import { useDispatch } from "react-redux";
import { updatePlayer } from "../redux/player";
import { Player } from "../types";

const requiredValidator = (message: string) => (value: any): string | undefined => !value ? message : undefined

const nameValidator = compose(
  requiredValidator("Você deve informar o nome")
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
              component={FormTextInput}
              validate={nameValidator}
            />

            <Button
              onPress={() => handleSubmit()}
            >
              Enviar
            </Button>
          </>
        )}
      />
    </ScrollView>
  )
}

export default withNavigation(EditPlayer)