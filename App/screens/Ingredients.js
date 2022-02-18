import React, { useState, useEffect } from 'react';

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

function Ingredients(props) {
  const [ingredientRows, setIngredientRows] = useState()

  useEffect(() => {
    fetchIngredients()
  }, [])

  async function fetchIngredients() {
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
            row.push({ "name": ingredient.name, "type": ingredient.type })
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
                let imageUri = 'https://source.unsplash.com/random/80x80/?' + ingredient.name.replace(' ', '+') + '+' + ingredient.type
                //imageUri.replace(' ', '+')
                return (
                  <Pressable key={key2} onPress={() => props.handleSetIngredient(ingredient.name)} alignItems="center" flex={1}>
                    <Avatar
                      size="80px"
                      source={{
                        uri: imageUri,
                      }}
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

export default Ingredients