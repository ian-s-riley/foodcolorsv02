import React, { useState, useEffect } from 'react';

//AWS Amplify GraphQL libraries
import { API, graphqlOperation } from 'aws-amplify';
import {
  listReasons
} from '../graphql/queries';

import {
  Box,
  Text,
  HStack,
  FlatList,
  VStack,
} from 'native-base';

function Info(props) {
  const item = props.currentIngredient ? props.currentIngredient : props.color
  const [reasons, setReasons] = useState()

  useEffect(() => {
    fetchReasons()
  }, [])

  async function fetchReasons() {
    API.graphql(
      graphqlOperation(listReasons, {
        filter: {
          ingredient: { eq: item },
        },
      })).then(
        response => {
          const myReasons = response.data.listReasons.items
          //console.log('myReasons', myReasons)                   
          setReasons(myReasons)
        },
        error => console.log('Load User Servings Error', error)
      )
  }

  return (
    <FlatList
      data={reasons}
      minHeight={400}
      mb={10}
      renderItem={({ item }) => (
        <Box
          borderBottomWidth="1"
          _dark={{
            borderColor: "gray.600",
          }}
          borderColor="coolGray.200"
          pl="4"
          pr="5"
          py="2"
        >
          <VStack>
            <HStack space={3}>
              <Text
                fontSize="md"
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                bold
              >
                {item.title}
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              _dark={{
                color: "warmGray.50",
              }}
              color="coolGray.800"
              alignSelf="flex-start"
            >
              {item.text}
            </Text>
          </VStack>
        </Box>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

export default Info