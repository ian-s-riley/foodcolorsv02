import React, { useState, useEffect } from 'react';

import { useDispatch, connect } from 'react-redux'
import { updateCurrentIngredient } from '../features/user/userSlice'

//AWS Amplify GraphQL libraries
import { API, graphqlOperation } from 'aws-amplify';
import {
  listIngredients
} from '../graphql/queries';

import {
  Box,
  Text,
  HStack,
  Pressable,
  VStack,
  Avatar,
  Center,
  NativeBaseProvider
} from 'native-base';

function mapStateToProps(state) {
  //console.log('Home.js - mapStateToProps - state.user', state.user)
  return {
    user: state.user,
  }
}

function Ingredients(props) {
  const dispatch = useDispatch()
  const [ingredientRows, setIngredientRows] = useState()

  useEffect(() => {
    fetchIngredients()
  }, [])

  async function fetchIngredients() {
    //console.log('Ingredients.js - props.color', props.color)
    API.graphql(
      graphqlOperation(listIngredients, {
        filter: {
          color: { eq: props.color },
        },
      })).then(
        response => {
          const myIngredients = response.data.listIngredients.items

          let allIngredients = []
          let row = []
          myIngredients.map((ingredient, key) => {
            //console.log('ingredient', ingredient.name + (key % 3))
            row.push({ "name": ingredient.name, "type": ingredient.type, "imageUri": ingredient.imageUri })
            if (key % 2 === 1) {
              allIngredients.push({ "ingredients": row })
              row = []
            }
          })
          row.length > 0
          allIngredients.push({ "ingredients": row })
          setIngredientRows(allIngredients)
        },
        error => console.log('Load User Servings Error', error)
      )
  }

  function handleSetIngredient(item) {
    const thisIngredient = props.user.currentIngredient === item ? "" : item
    dispatch(updateCurrentIngredient({ ...props.user, "currentIngredient": thisIngredient }))
  }

  return (
    <NativeBaseProvider>
      <Center flex={1} p="2" w="100%" bgColor="gray.100">

        <Box
          borderColor="gray.200"
          borderWidth="2"
          width="98%"
          rounded="xl"
          flex={1}
          alignItems="center"
          bgColor="white"
          overflow="hidden">

          {ingredientRows && ingredientRows.map((row, key1) => {
            return (
              <VStack key={key1} space="3" p="2">
                <HStack space="5">
                  {row.ingredients.map((ingredient, key2) => {
                    //let imageUri = 'https://source.unsplash.com/random/80x80/?' + ingredient.name.replace(' ', '+') + '+' + ingredient.type
                    //imageUri.replace(' ', '+')   
                    console.log('ingredient.imageUri', ingredient.imageUri)                 
                    return (
                      <Pressable key={key2} onPress={() => handleSetIngredient(ingredient.name)} alignItems="center" flex={1}>
                        <Avatar
                          size="80px"
                          borderWidth={props.user.currentIngredient === ingredient.name ? 4 : 0}
                          borderColor={props.color + '.400'}
                          source={require('../assets/' + ingredient.imageUri)}
                        />
                        <Text>{ingredient.name}</Text>
                      </Pressable>
                    )
                  }
                  )}
                </HStack>
              </VStack>
            )
          })
          }
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}

export default connect(mapStateToProps)(Ingredients)