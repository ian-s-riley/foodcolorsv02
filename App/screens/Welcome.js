import React from 'react';

import {
  Box,
  Heading,
  Icon,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Pressable,
  IconButton,
} from 'native-base';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Welcome({ navigation }) {
  return (
    <NativeBaseProvider>

      <Center
        flex={1}
        bgColor="white"
        px={3}
        py={3}
        alignItems="center"
        justifyContent="flex-start">

        <Box
          w="100%"
          rounded="xl"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
        >
<AspectRatio w="100%" ratio={16 / 9}>
            <Image
              source= {require('../assets/GreenVegetables.png')}
              alt="image"
            />
          </AspectRatio>
        </Box>
        <Stack p="4" space={3}>
          <Stack space={2}>
            <Heading size="md" ml="-1">
              Eat 5 Colors of Food Every Day!
            </Heading>
            <Text
              fontSize="xs"
              _light={{
                color: "violet.500",
              }}
              _dark={{
                color: "violet.400",
              }}
              fontWeight="500"
              ml="-0.5"
              mt="-1"
            >
              An easy way to eat better.
            </Text>
          </Stack>
          <Text fontWeight="400">
          Each color of fruit and vegetable has unique nutritional benefits important to your health.
          </Text>
          <Text fontWeight="400">
          Different colors of fruits & veggies have compounds that may contribute to your health. These can work together to promote overall health, so remember to eat all colors every day!
          </Text>
        </Stack>
      </Center>

    </NativeBaseProvider>
  );
}