import React, { useState, useEffect } from 'react';
import axios from "axios";

import {
  Center,
  Box,
  Icon,
  Text,
  HStack,
  Link,
  FlatList,
  VStack,
  Spacer,
  Avatar,
  ScrollView,
  NativeBaseProvider
} from 'native-base';

function Recipes(props) {
  const [menuItems, setMenuItems] = useState()

  useEffect(() => {
    console.log('Recipes.js - props.currentIngredient', props.currentIngredient)

    //get some recipes
    var options = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
      params: {
        query: props.color,
        includeIngredients: props.currentIngredient,
        diet: props.currentIngredient === "" ? "vegetarian" : props.diet,
        offset: '0',
        number: '10',
        instructionsRequired: 'false',
        addRecipeInformation: 'true',
        maxAlcohol: 0,
        sort: 'random',
      },
      headers: {
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'x-rapidapi-key': '4a4aed7ddemsh383a18ce58353dbp1d5a08jsn28aee8b442d0'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setMenuItems(response.data.results)
    }).catch(function (error) {
      console.error(error);
    });
  }, [props.currentIngredient])

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
      <FlatList
        data={menuItems}
        minHeight={400}
        renderItem={({ item }) => (
          <Link href={item.sourceUrl} isExternal>
            <Box
              borderBottomWidth="1"
              borderColor="coolGray.200"
              p="2"
              mr={3}
            >
              <HStack space={3}>
                <Avatar
                  size="48px"
                  source={{
                    uri: item.image,
                  }}
                />
                <VStack overflow="hidden">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                  >
                    {item.title}
                  </Text>
                  <Text
                    mr={3}
                    color="coolGray.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                  >
                    {item.readyInMinutes} minutes
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Link>
        )}
        keyExtractor={(item) => item.title}
      />
    </Box>
    </Center>
    </NativeBaseProvider>
  );
}

export default Recipes