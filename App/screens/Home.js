import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useDispatch, connect } from 'react-redux'
import { getUserAsync, getServingsAsync, updateCurrentDate } from '../features/user/userSlice'

import moment from 'moment';

import {
  NativeBaseProvider,
  Box,
  Pressable,
  HStack,
  IconButton,
  VStack,
  Button,
  Icon,
  Center,
  Text,
  useDisclose,
} from "native-base"
import { MaterialCommunityIcons } from '@expo/vector-icons';

function mapStateToProps(state) {
  console.log('Home.js - mapStateToProps - state.user', state.user)
  return {
    user: state.user,
  }
}

function Home(props) {
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const { isOpen, onToggle } = useDisclose()
  const [userIcon, setUserIcon] = useState(
    <Icon
      as={MaterialCommunityIcons}
      size="40"
      name="emoticon-wink-outline"
      color="gray.400"
      _dark={{
        color: "gray.400",
      }}
    />
  )
  const [blueColor, setBlueColor] = useState("blue.50");

  // useEffect(() => {
  //   fetchUser()
  // }, [props.user.username])

  // async function fetchUser() {
  //   console.log('useEffect - fetchUser - props.user', props.user)
  //   props.user.username !== "" && dispatch(getUserAsync(props.user))
  // }

  useEffect(() => {
    fetchServings()
  }, [props.user.currentDate])

  async function fetchServings() {
    props.user.id !== "" && dispatch(getServingsAsync(props.user))
  }

  useEffect(() => {
    chooseIcon()
  }, [props.user.servings, isOpen])

  function chooseIcon() {
    let level = 0
    props.user.red > 0 && level++
    props.user.orange > 0 && level++
    props.user.yellow > 0 && level++
    props.user.green > 0 && level++
    props.user.purple > 0 && (level++)

    let color = "gray.50"
    level === 0 && (color = "gray.400")
    level === 1 && (color = "orange.400")
    level === 2 && (color = "red.400")
    level === 3 && (color = "indigo.400")
    level === 4 && (color = "green.400")
    level === 5 && (color = "yellow.400")

    let size = 40

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

  function Capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
  }

  const renderItem = (color) => (
    <Button
      textAlign="center"
      rounded="xl"
      shadow="2"
      colorScheme={color}
      width="75px"
      height="75px"
      onPress={() => navigation.navigate(Capitalize(color))}
      _text={{
        fontSize: "25",
        fontWeight: "bold",
        color: "gray.50",
      }}>
      {props.user[color] === 0 ? "0" : props.user[color]}
    </Button>
  );

  function handleDateChange(days) {
    if (days === 0) {
      let newDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
      dispatch(updateCurrentDate({ ...props.user, "currentDate": newDate, "isToday": false }))
    } else {
      let newDate = moment(props.user.currentDate).add(days, 'd')
      let newDateFormatted = moment(newDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
      let today = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
      let isToday = (newDateFormatted === today)
      dispatch(updateCurrentDate({ ...props.user, "currentDate": newDate.format('YYYY-MM-DD'), "isToday": isToday }))
    }
  }

  return (
    <NativeBaseProvider>
      <Center flex={1} p="2" w="100%" bgColor="gray.50">

        <Box
          borderColor="gray.200"
          borderWidth="2"
          width="98%"
          rounded="xl"
          flex={1}
          alignItems="center"
          bgColor="white">

          <HStack space="1">
            {userIcon}
            <Icon
              as={MaterialCommunityIcons}
              size="12"
              name="cup-water"
              color={blueColor}
              alignSelf="flex-end"
              ml="-8"
              mb="5"
            />
            {props.user.blue > 5 && (
              <Icon
                as={MaterialCommunityIcons}
                size="7"
                name="star"
                color="yellow.300"
                alignSelf="flex-end"
                ml="-6"
                mb="5"
              />
            )}
          </HStack>

          <HStack space={4} alignItems="center" mt="4" mb="4">
            <VStack space={2}>
              {renderItem('red')}
              {renderItem('green')}
            </VStack>
            <VStack space={2}>
              {renderItem('orange')}
              {renderItem('purple')}
            </VStack>
            <VStack space={2}>
              {renderItem('yellow')}
              {renderItem('blue')}
            </VStack>
          </HStack>

          <HStack space={4} alignItems="center" mt="10" mb="2">
            <IconButton
              variant="outline"
              colorScheme="gray"
              borderRadius="full"
              size="md"
              onPress={() => handleDateChange(-1)}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="5"
                  name="arrow-left"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />

            <Text fontSize={20} color="gray.400">{props.user.currentDate}</Text>

            <IconButton
              variant={!props.user.isToday ? ("outline") : ("unstyled")}
              colorScheme="gray"
              borderRadius="full"
              size="md"
              onPress={() => !props.user.isToday && handleDateChange(1)}
              onLongPress={() => !props.user.isToday && handleDateChange(0)}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="4"
                  name="arrow-right"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />
          </HStack>

        </Box>



      </Center>
     

    </NativeBaseProvider>
  );
};

export default connect(mapStateToProps)(Home)