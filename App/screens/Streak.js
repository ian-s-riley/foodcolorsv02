import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { useDispatch, connect } from 'react-redux'
import { API, graphqlOperation } from 'aws-amplify';
import {
  listServings,
} from '../graphql/queries';

import {
  Box,
  Icon,
  Text,
  Center,
  HStack,
  NativeBaseProvider,
  Pressable,
  VStack,
  IconButton,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

function Streak(props) {
  const navigation = useNavigation()

  const [thisWeek, setThisWeek] = useState()
  const [servings, setServings] = useState()
  const [lastDate, setLastDate] = useState()

  const [firstDay, setFirstDay] = useState()
  const [lastDay, setLastDay] = useState()

  const [next, setNext] = useState(false)

  const [loading, setLoading] = useState(true)
  const shell = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

  useEffect(() => {
    fetchServings()
  }, [lastDate])

  async function fetchServings() {
    let week = []

    //if we have a lastDate given, use that instead of today    
    const today = moment(new Date())

    let lastDateofSeries = today
    if (lastDate) { lastDateofSeries = moment(lastDate, 'YYYY-MM-DD').format('YYYY-MM-DD') }
    //console.log('latsDayofSeries', lastDateofSeries)

    //get the formatted date for each day in this series
    shell.map((index) => {
      let thisDay = moment(lastDateofSeries).subtract(index, "days")
      week.push(thisDay.format('YYYY-MM-DD'))
    })
    setThisWeek(week)
    setFirstDay(week[0])
    setLastDay(week[week.length - 1])

    //console.log('lastDateofSeries', lastDateofSeries)
    //console.log('today', today)
    setNext(moment(lastDateofSeries).format('YYYY-MM-DD') !== moment(today).format('YYYY-MM-DD'))


    API.graphql(
      graphqlOperation(listServings, {
        filter: {
          datetime: { between: [week[0], week[week.length - 1]] },
          and: { userId: { eq: props.user.id } }
        },
      })).then(
        response => {
          // //console.log('fetchServings', response.data.listServings.items)
          setServings(response.data.listServings.items)
          setLoading(false)
        },
        error => console.log('Load User Servings Error', error)
      )
  }

  function handleDateChange(direction) {
    if (direction === 0) {
      //go back to the current date
      //setLastDate(moment(new Date()))
    } else if (direction === 1) {
      //go forward 
      let nextButtonDate = moment(lastDay, 'YYYY-MM-DD')
      nextButtonDate.add(shell.length, "days")
      setLastDate(nextButtonDate)
    } else if (direction === -1) {
      //set the last day of the series a day before this series      
      let previousButtonDate = moment(firstDay, 'YYYY-MM-DD')
      previousButtonDate.subtract(1, "days")
      setLastDate(previousButtonDate)
    }
  }

  function colorBox(color, count) {
    return (
    [...Array(count)].map((e, i) => {
      return (<Box key={i} h="5" w="5" bg={color + ".400"} borderRadius="full" />)
    })
    )
  }

  function blueBox(color, count) {
    return (
    [...Array(count)].map((e, i) => {
      return (<Box key={i} h="5" w="5" bg={color + ".400"} borderRadius="full" />)
    })
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
          <Box flex={1}>
            {loading ? (
              <Text>Loading</Text>
            ) : (
              <>

                <Box bgColor="white" flex={1} mt="5" p="5" justifyContent="center" alignItems="center">

                  <HStack space={0}>
                    {servings && thisWeek.map((day, key) => {
                      let red = servings.filter(serving => serving.color === 'red' && serving.datetime === day).length
                      let orange = servings.filter(serving => serving.color === 'orange' && serving.datetime === day).length
                      let yellow = servings.filter(serving => serving.color === 'yellow' && serving.datetime === day).length
                      let green = servings.filter(serving => serving.color === 'green' && serving.datetime === day).length
                      let purple = servings.filter(serving => serving.color === 'purple' && serving.datetime === day).length
                      let total = red + orange + yellow + green + purple
                      return (
                        <VStack key={key} justifyContent="flex-end">
                        {total === 0 && (<Box h="1" w="5" bg="white" />)}
                        {colorBox("red", red)}
                        {colorBox("orange", orange)}
                        {colorBox("yellow", yellow)}
                        {colorBox("green", green)}
                        {colorBox("purple", purple)}
                        </VStack>
                      )
                    })}
                  </HStack>
                  <HStack space={0}>
                    {servings && thisWeek.map((day, key) => {
                      return (
                        <VStack key={key}>
                          <Center h="5" w="5" borderWidth="1" borderColor="gray.200">
                            <Text>{day.substring(8, 10)}</Text>
                          </Center>
                        </VStack>
                      )
                    })}
                  </HStack>
                  <HStack space={0}>
                    {servings && thisWeek.map((day, key) => {
                      let blue = servings.filter(serving => serving.color === 'blue' && serving.datetime === day).length
                      return (
                        <VStack key={key} justifyContent="flex-start">                        
                        {blue === 0 ? (
                          <Box h="1" w="5" bg="white" />
                        ) : (
                          blueBox("blue", blue)
                        )}                       
                        </VStack>
                      )
                    })}
                  </HStack>
                </Box>
              </>
            )}

          </Box>

          {thisWeek && (



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
                    size="4"
                    name="arrow-left"
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="warmGray.50"
                  />
                }
              />

              <Text fontSize={20} color="gray.400">{firstDay.substring(5) + " to " + lastDay.substring(5)}</Text>

              <IconButton
                variant={next ? ("outline") : ("unstyled")}
                disabled={!next}
                colorScheme="gray"
                borderRadius="full"
                size="md"
                onPress={() => handleDateChange(1)}
                onLongPress={() => handleDateChange(0)}
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

          )}
        </Box>
      </Center>

    </NativeBaseProvider>

  );
}

export default connect(mapStateToProps)(Streak)