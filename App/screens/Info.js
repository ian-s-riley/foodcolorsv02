import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

//AWS Amplify GraphQL libraries
import { API, graphqlOperation } from 'aws-amplify';
import {
  listReasons
} from '../graphql/queries';

import {
  Center,
  Box,
  Text,
  HStack,
  FlatList,
  VStack,
  NativeBaseProvider,
} from 'native-base';

function mapStateToProps(state) {
  //console.log('Info.js - mapStateToProps - state.user', state.user)
  return {
    user: state.user,
  }
}

function Info(props) {
  console.log('Info.js props', props)
  const item = props.currentIngredient ? props.currentIngredient : props.color
  const [reasons, setReasons] = useState()

  useEffect(() => {
    fetchReasons()
  }, [])

  async function fetchReasons() {
    //console.log('info.js - item', item)
    API.graphql(
      graphqlOperation(listReasons, {
        filter: {
          ingredient: { eq: item },
        },
      })).then(
        response => {
          const myReasons = response.data.listReasons.items
          console.log('myReasons', myReasons)                   
          setReasons(myReasons)
        },
        error => console.log('Load User Servings Error', error)
      )
  }

  function Capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
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
          <Text bold color={props.user.color + ".500"}>Eat {Capitalize(props.user.color)} Because...</Text>
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
    </Box>
</Center>
</NativeBaseProvider>
  );
}

export default connect(mapStateToProps)(Info)