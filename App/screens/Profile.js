import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';

import { useDispatch, connect } from 'react-redux'
import { updateUserAsync } from '../features/user/userSlice'

import { Auth } from 'aws-amplify';

import {
  Box,
  Icon,
  Text,
  Center,
  HStack,
  NativeBaseProvider,
  Pressable,
  useDisclose,
  Stagger,
  IconButton,
  Modal,
  FormControl,
  Input,
  Button,
  Select,
  CheckIcon,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

function Profile(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const { isOpen, onToggle } = useDisclose(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState(props.user.name)
  const [diet, setDiet] = useState(props.user.diet)

  async function signOut() {
    try {
      await Auth.signOut();
      navigation.navigate("Home")
    } catch (error) {
      //console.log('Error signing out: ', error);
    }
  }

  async function handleSave() {
    dispatch(updateUserAsync({ ...props.user, "name": name, "diet": diet}))
  }

  return (
    <NativeBaseProvider>
      <Center flex={1} bgColor="white">
        <IconButton
          variant="solid"
          borderRadius="full"
          width="140px"
          height="140px"
          onPress={onToggle}
          bg="cyan.400"
          mb="4"
          icon={
            <Icon
              as={MaterialCommunityIcons}
              size="105px"
              name="account-cog-outline"
              color="warmGray.50"
              _dark={{
                color: "warmGray.50",
              }}
            />
          }
        />
        <Box alignItems="center" minH="220">
          <Stagger
            visible={isOpen}
            initial={{
              opacity: 0,
              scale: 0,
              translateY: 34,
            }}
            animate={{
              translateY: 0,
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                mass: 0.8,
                stagger: {
                  offset: 30,
                  reverse: true,
                },
              },
            }}
            exit={{
              translateY: 34,
              scale: 0.5,
              opacity: 0,
              transition: {
                duration: 100,
                stagger: {
                  offset: 30,
                  reverse: true,
                },
              },
            }}
          >
            <IconButton
              mt="4"
              variant="solid"
              bg="indigo.500"
              colorScheme="indigo"
              borderRadius="full"
              onPress={() => navigation.navigate("Streak")}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name="chart-bar-stacked"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />
            <Text fontSize={15} color="gray.400">Streaks</Text>
            <IconButton
              mt="4"
              variant="solid"
              colorScheme="green"
              borderRadius="full"
              onPress={() => navigation.navigate("Joke")}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name="emoticon-wink-outline"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />
            <Text fontSize={15} color="gray.400">Joke</Text>
            <IconButton
              mt="4"
              variant="solid"
              bg="teal.400"
              colorScheme="teal"
              borderRadius="full"
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  _dark={{
                    color: "warmGray.50",
                  }}
                  size="6"
                  name="account"
                  color="warmGray.50"
                  onPress={() => setShowModal(true)}
                />
              }
            />
            <Text fontSize={15} color="gray.400">My Info</Text>            
            <IconButton
              mt="4"
              variant="solid"
              bg="red.500"
              colorScheme="red"
              borderRadius="full"
              onPress={signOut}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name="account-off-outline"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />
            <Text fontSize={15} color="gray.400">Sign Out</Text>
          </Stagger>
        </Box>
      </Center>      

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>My Info</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Name</FormControl.Label>
              <Input defaultValue={name} onChangeText={text => setName(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Diet</FormControl.Label>
              <Select
                selectedValue={diet}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Choose Service"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => setDiet(itemValue)}
              >
                <Select.Item label="Omnivore" value="" />
                <Select.Item label="Vegetarian" value="vegetarian" />
                <Select.Item label="Vegan" value="vegan" />
              </Select>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  handleSave()
                  setShowModal(false)
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

    </NativeBaseProvider>

  );
}

export default connect(mapStateToProps)(Profile)