import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';

import { useDispatch, connect } from 'react-redux'
import { addServingAsync, deleteServingAsync, updateColors, updateCurrentColor, updateServings } from '../features/user/userSlice'

import {
  Box,
  Icon,
  Image,
  Text,
  Center,
  HStack,
  NativeBaseProvider,
  Pressable,
  VStack,
  Spacer,
  IconButton,
  Button,
  Modal,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Ingredients from './Ingredients';
import Info from './Info';
import Recipes from './Recipes';

//const fallBackImg = require('../src/assets/GreenVegetables.png');

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

function Colors(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const [currentIngredient, setCurrentIngredient] = useState("")
  const [showInfo, setShowInfo] = useState(false)
  const [showRecipes, setShowRecipes] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)

  const type = Math.random() < 0.5 ? ("vegetable") : ("fruit")
  const imageUri = props.color === 'blue' ? 'https://source.unsplash.com/200x300/?fresh+water+drink' : 'https://source.unsplash.com/200x300/?' + type + '+' + props.color

  const [userIcon, setUserIcon] = useState(
    <Icon
      as={MaterialCommunityIcons}
      size="25"
      name="emoticon-wink-outline"
      color="gray.400"
      _dark={{
        color: "gray.400",
      }}
    />
  )
  const [blueColor, setBlueColor] = useState("blue.50");

  useEffect(() => {
    chooseIcon()
    dispatch(updateCurrentColor({ ...props.user, "currentColor": props.color }))
  }, [props.user.servings])

  function chooseIcon() {

    let level = 0
    props.user.red > 0 && level++
    props.user.orange > 0 && level++
    props.user.yellow > 0 && level++
    props.user.green > 0 && level++
    props.user.purple > 0 && (level++)

    let color = props.color + ".400"

    let size = 20

    //water
    props.user.blue === 1 && setBlueColor("blue.50")
    props.user.blue === 2 && setBlueColor("blue.100")
    props.user.blue === 3 && setBlueColor("blue.200")
    props.user.blue === 4 && setBlueColor("blue.300")
    props.user.blue === 5 && setBlueColor("blue.400")
    props.user.blue === 6 && setBlueColor("blue.500")
    props.user.blue === 7 && setBlueColor("blue.600")
    props.user.blue === 8 && setBlueColor("blue.700")
    props.user.blue === 9 && setBlueColor("blue.800")

    let icon = (
      <Icon
        as={MaterialCommunityIcons}
        size={size}
        name="emoticon-wink-outline"
        color={color}
        _dark={{
          color: "gray.400",
        }}
      />
    )
    switch (level) {
      case 0:
        icon = (<Icon
          as={MaterialCommunityIcons}
          size={size}
          name="emoticon-sad-outline"
          color={color}
          _dark={{
            color: "gray.400",
          }}
        />)
        break;
      case 1:
        icon = (<Icon
          as={MaterialCommunityIcons}
          size={size}
          name="emoticon-confused-outline"
          color={color}
          _dark={{
            color: "gray.400",
          }}
        />)
        break;
      case 2:
        icon = (<Icon
          as={MaterialCommunityIcons}
          size={size}
          name="emoticon-neutral-outline"
          color={color}
          _dark={{
            color: "gray.400",
          }}
        />)
        break;
      case 3:
        icon = (<Icon
          as={MaterialCommunityIcons}
          size={size}
          name="emoticon-happy-outline"
          color={color}
          _dark={{
            color: "gray.400",
          }}
        />)
        break;
      case 4:
        icon = (<Icon
          as={MaterialCommunityIcons}
          size={size}
          name="emoticon-excited-outline"
          color={color}
          _dark={{
            color: "gray.400",
          }}
        />)
        break;
      case 5:
        icon = (<Icon
          as={MaterialCommunityIcons}
          size={size}
          name="star-face"
          color={color}
          _dark={{
            color: "gray.400",
          }}
        />)
        break;
      default:
    }
    setUserIcon(icon)
  }

  async function handleAddServing() {
    //console.log('handleAddServing - currentDate', props.user.currentDate)
    //only update the servings for today    
    //if (props.user.isToday) {
    try {
      //increment this color
      dispatch(updateColors({ ...props.user, [props.color]: props.user[props.color] + 1 }))

      //add the serving
      const newServing = { id: uuid.v4(), userId: props.user.id, color: props.color, datetime: props.user.currentDate, add: true }
      dispatch(addServingAsync({ ...props.user, "newServing": newServing }))

    } catch (err) {
      //console.log('error creating serving:', err)
    }
    //}
  }

  async function handleDeleteServing() {
    if (props.user.isToday) {
      let allServings = Object.assign([], props.user.servings)
      let thisColorServings = allServings.filter(serving => serving.color === props.color)

      if (thisColorServings.length > 0) {
        let servingId = thisColorServings[0].id
        //console.log('handleDeleteServing - servingId', servingId)
        let newServings = allServings.filter(serving => serving.id !== servingId)
        //console.log('handleDeleteServing - newServings', newServings)
        dispatch(deleteServingAsync({ ...props.user, "servingId": servingId }))
        dispatch(updateServings({ ...props.user, "servings": newServings }))
        dispatch(updateColors({ ...props.user, [props.color]: props.user[props.color] - 1 }))
      }
    }
  }

  function handleSetIngredient(item) {
    setCurrentIngredient(item)
    setShowIngredients(false)
  }

  function Capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
  }

  return (
    <NativeBaseProvider>
      <Center flex={1} p="2" w="100%" bgColor="gray.50">

        <Box
          borderColor="gray.200"
          borderWidth="1"
          width="98%"
          rounded="xl"
          alignItems="center"
          bgColor="white"
          overflow="hidden"
          flex={1}>
          <VStack space={5} width="100%">
            <Box>
              <Image height={200}
                source={{
                  uri: imageUri
                }}
                alt="image"
              />
              <HStack
                bgColor="transparent"
                position="absolute"
                bottom="0"
                p="3"
                space="2"
                width="100%"
              >
                <Center alignSelf="flex-end">
                  <Button
                    textAlign="center"
                    rounded="full"
                    variant="outline"
                    size="lg"
                    bgColor={props.color + ".500"}
                    borderWidth={0}>
                    <HStack>
                      <Text fontSize="lg" bold color="gray.50">
                        {props.user[props.color] === 0 ? ("0") : (props.user[props.color])} Servings
                      </Text>
                    </HStack>
                  </Button>
                </Center>
                <Spacer flex={1} />

                <VStack>

                  <HStack space="1" mb="5">
                    <Box
                      rounded="md"
                      bgColor="white"
                      borderRadius="xl"
                      width="100px"
                      borderColor="gray.200"
                      mb="5"
                    >
                      <HStack space={2}>
                        {userIcon}
                        <Icon
                          as={MaterialCommunityIcons}
                          size="8"
                          name="cup-water"
                          color={blueColor}
                          alignSelf="flex-end"
                          ml="-6"
                          mb="1"
                        />
                        {props.user.blue > 5 && (
                          <Icon
                          as={MaterialCommunityIcons}
                          size="5"
                          name="star"
                          color="yellow.300"
                          alignSelf="flex-end"
                          ml="-5"
                          mb="1"
                        />
                        )}                        
                      </HStack>

                    </Box>
                  </HStack>
                  <HStack space={3}>
                    <IconButton
                      size="md"
                      rounded="full"
                      variant="solid"
                      colorScheme={props.color}
                      bgColor={props.color + ".500"}
                      rounded="full"
                      icon={
                        <Icon
                          as={MaterialCommunityIcons}
                          name="plus"
                          color="gray.50"
                        />
                      }
                      onPress={() => handleAddServing()}
                    />
                    <IconButton
                      size="md"
                      rounded="full"
                      variant="solid"
                      colorScheme={props.color}
                      bgColor={props.color + ".400"}
                      rounded="full"
                      icon={
                        <Icon
                          as={MaterialCommunityIcons}
                          name="minus"
                          color="gray.50"
                        />
                      }
                      onPress={() => handleDeleteServing()}
                    />
                  </HStack>
                </VStack>
              </HStack>
            </Box>
            
            {props.color === 'blue' ? (
              <Info color="blue" />
            ) : (
              <VStack space={5}>
              <Pressable
                  px="3"
                  py="3"
                  w="95%"
                  alignSelf="center"
                  rounded="xl"
                  borderWidth="1"
                  borderColor="coolGray.200"
                  bgColor={props.color + '.50'}
                  onPress={() => { navigation.navigate(props.color + 'ingredients') }}
                >
                  <HStack space="7">
                    <Text>
                      {Capitalize(props.color)} Fruit & Veggies
                    </Text>
                    <Spacer />
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={showIngredients ? ('chevron-down') : ('chevron-right')}
                        />
                      }
                      color="gray.400"
                      size="sm"
                    />
                  </HStack>
                </Pressable>

                <Pressable
                  px="3"
                  py="3"
                  w="95%"
                  alignSelf="center"
                  rounded="xl"
                  borderWidth="1"
                  borderColor="coolGray.200"
                  bgColor={props.color + '.50'}
                  onPress={() => { navigation.navigate(props.color + 'info') }}
                >
                  <HStack space="7" alignItems="center" width="100%">
                    <Text>
                      {currentIngredient === "" ? (
                        "Eat " + Capitalize(props.color) + " Fruit & Veggies Because..."
                      ) : (
                        "Eat " + Capitalize(currentIngredient) + " Because..."
                      )}
                    </Text>
                    <Spacer />
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={showRecipes ? ('chevron-down') : ('chevron-right')}
                        />
                      }
                      color="gray.400"
                      size="sm"
                    />
                  </HStack>
                </Pressable>
                
                <Pressable
                  px="3"
                  py="3"
                  w="95%"
                  alignSelf="center"
                  rounded="xl"
                  borderWidth="1"
                  borderColor="coolGray.200"
                  bgColor={props.color + '.50'}
                  onPress={() => { navigation.navigate(props.color + 'recipes') }}
                >
                  <HStack space="7" alignItems="center" width="100%">
                    <Text>
                      {props.user.currentIngredient === "" ? (
                        "Recipes with " + Capitalize(props.color) + " Fruit & Veggies"
                      ) : (
                        "Recipes with " + Capitalize(props.user.currentIngredient)
                      )}
                    </Text>
                    <Spacer />
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={showRecipes ? ('chevron-down') : ('chevron-right')}
                        />
                      }
                      color="gray.400"
                      size="sm"
                    />
                  </HStack>
                </Pressable>
              </VStack>
            )}

          </VStack>
        </Box>
      </Center>            
    </NativeBaseProvider>

  );
}

export default connect(mapStateToProps)(Colors)