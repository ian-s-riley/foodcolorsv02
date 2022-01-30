import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import axios from "axios";

import {
  Box,
  Heading,
  Icon,
  Text,
  Center,
  HStack,
  NativeBaseProvider,
  Link,
  Pressable,
  ScrollView,
  Spacer,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Joke() {
  const navigation = useNavigation();
  const [joke, setJoke] = useState()

  useEffect(() => {
    var options = {
      method: 'GET',
      url: 'https://humor-jokes-and-memes.p.rapidapi.com/jokes/random',
      params: {
        'api-key': '11e9e367e53e41b0a5782bf7d75d9011',
        'exclude-tags': 'yo_mama,nsfw,racist,sexist,sexual,political,religious,christmas,dark,jewish,sport,law,relationship,insults,blondes',
        'min-rating': '7',
        'include-tags': 'food',
        'max-length': '200'
      },
      headers: {
        'x-rapidapi-host': 'humor-jokes-and-memes.p.rapidapi.com',
        'x-rapidapi-key': '4a4aed7ddemsh383a18ce58353dbp1d5a08jsn28aee8b442d0'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setJoke(response.data.joke)
    }).catch(function (error) {
      console.error(error);
    });

  }, [])

  return (
    <NativeBaseProvider>
      <Center flex={1} p="2" w="100%" bgColor="gray.50" safeArea>

        <Box
          borderColor="gray.200"
          borderWidth="2"
          width="98%"
          rounded="xl"
          flex={1}
          alignItems="center"
          bgColor="white"
          overflow="hidden">

          {true && (
            <ScrollView
              _contentContainerStyle={{
                px: "20px",
                py: "10px",
                mb: "4",
                minW: "72",
                minH: "300"
              }}
            >
              <Center mt="3" mb="4">
                <Heading>LOL</Heading>
                <Text mt="2" fontSize="lg">
                  {joke}
                </Text>
                <Spacer />
                <Link href="https://www.youtube.com/watch?v=-02rltfa7AY&autoplay=1" isExternal>
                  <Box
                    mt="5"
                    bgColor="white"
                    justifyContent="center"
                    _pressed={{
                      opacity: 0.5,
                    }}>
                    <Icon
                      as={<MaterialCommunityIcons name="emoticon-wink-outline" />}
                      size="lg"
                      color={"gray.400"}
                    />
                  </Box>
                </Link>

              </Center>
            </ScrollView>
          )}
        </Box>
      </Center>
      <HStack bg="gray.50" alignItems="center" safeAreaBottom shadow={6}>
        <Pressable
          opacity={.5}
          py="3"
          flex={1}
          onPress={() => navigation.navigate("Home")}
        >
          <Center>
            <Icon
              mb="1"
              as={
                <MaterialCommunityIcons
                  name={'home-outline'}
                />
              }
              color="gray.400"
              size="sm"
            />
          </Center>
        </Pressable>
        <Pressable
          opacity={0.5}
          py="2"
          flex={1}
          onPress={() => navigation.navigate("Profile")}
        >
          <Center>
            <Icon
              mb="1"
              as={<MaterialCommunityIcons
                name={'account'}
              />}
              color="gray.400"
              size="sm"
            />
          </Center>
        </Pressable>
      </HStack>



    </NativeBaseProvider>

  );
}

export default Joke