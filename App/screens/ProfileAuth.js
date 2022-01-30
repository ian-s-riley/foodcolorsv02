import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';

import { useDispatch, connect } from 'react-redux'
import { addUserAsync, updateUserAsync } from '../../src/features/user/userSlice'

//AWS Amplify GraphQL libraries
import { API, graphqlOperation } from 'aws-amplify';
import {
  listUsers,
} from '../graphql/queries'

import uuid from 'react-native-uuid';
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
  VStack,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function mapStateToProps(state) {
  //console.log('ProfileAuth.js - mapStateToProps - user', state.user)
  return {
    user: state.user,
  }
}

function ProfileAuth(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const { isOpen, onToggle } = useDisclose(true)
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')

  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showNewCode, setShowNewCode] = useState(false);
  const [showNewCodeVerify, setShowNewCodeVerify] = useState(false);

  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState('');

  async function handleButtonClick() {
    setErrorMsg('')
    if (showSignin) {
      signIn()
    } else if (showSignup) {
      signUp()
    } else if (showNewCode) {
      sendCode()
    } else if (showVerify) {
      verify()
    }
  }

  async function signInAWSUser(username, password) {
    try {
      await Auth.signIn(username, password);
      //console.log('AWS Auth Success');
    } catch (error) {
      //console.log('AWS Auth Fail');
      setIsLoading(false)
      setErrorMsg('Whoops: ' + error.message)
    }
  }

  async function signIn() {
    const phoneNumber = countryCode + phone
    console.log('signIn - phoneNumber', phoneNumber)

    //validation
    let isValid = true

    if (phone.length < 10) {
      isValid = false
      setErrorMsg("Whoops: please enter a 10 digit phone number.")
    }

    isValid == false
    if (isValid) {
      setIsLoading(true)
      lookupPasswordAndSignin(phoneNumber)
    }
  }

  async function signUp() {
    const phoneNumber = countryCode + phone
    const passCode = generatePassCode()
    setPassword(passCode)
    //('signUp - phoneNumber', phoneNumber)
    //console.log('signUp - passCode', passCode)

    //validation
    let isValid = true

    if (phone.length < 10) {
      isValid = false
      setErrorMsg("Whoops:  please enter a 10 digit phone number.")
    } else {
      setErrorMsg('')
    }

    if (isValid) {
      setIsLoading(true)
      try {
        await Auth.signUp({
          'username': phoneNumber,
          'password': passCode,
          'attributes': {
            'phone_number': phoneNumber
          }
        });
        //console.log(' Success');

        const newUser = {
          id: uuid.v4(),
          username: phoneNumber,
          password: passCode,
          phoneNumber: phoneNumber,
          email: "",
          name: "",
          icon: "",
          diet: "",
        }
        dispatch(addUserAsync({ ...props.user, "newUser": newUser }))

        setIsLoading(false)
        setShowSignup(false)
        setShowVerify(true)
      } catch (error) {
        setErrorMsg('Whoops: ' + error.message)
        setIsLoading(false)
      }
    }
  }

  async function sendCode() {
    const phoneNumber = countryCode + phone
    //console.log('sendCode - phoneNumber', phoneNumber)

    //validation
    let isValid = true

    if (phone.length < 10) {
      isValid = false
      setErrorMsg("Whoops: please enter a 10 digit phone number.")
    } else {
      setErrorMsg('')
    }

    if (isValid) {
      setIsLoading(true)
      try {
        //await Auth.forgotPassword(phoneNumber);
        await Auth.resendSignUp(phoneNumber);
        setShowNewCode(false)
        setShowVerify(true)
        setIsLoading(false)
        //console.log(' Success');
      } catch (error) {
        //console.log(' Error forgetting password...', error);
        setIsLoading(false)
        setErrorMsg('Whoops: ' + error.message)
      }
    }
  }

  async function verify() {
    const phoneNumber = countryCode + phone
    //console.log('verify - phoneNumber', phoneNumber)
    //console.log('verify - password', password)
    //console.log('verify - code', code)

    //validation
    let isValid = true

    if (phone.length < 10) {
      isValid = false
      setErrorMsg("Whoops: please enter a 10 digit phone number.")
    } else if (code.length !== 6) {
      isValid = false
      setErrorMsg("Whoops: please enter a 6 digit code.")
    } else {
      setErrorMsg('')
    }

    if (isValid) {
      setIsLoading(true)
      try {
        await Auth.confirmSignUp(phoneNumber, code);
        //console.log(' Success');
        //sign in the new user
        //signInAWSUser(phoneNumber, password)
        lookupPasswordAndSignin(phoneNumber)
      } catch (error) {
        //console.log(' Error verify signup', error);
        setIsLoading(false)
        setErrorMsg('Whoops: ' + error.message)
      }
    }
  }  

  async function lookupPasswordAndSignin(phoneNumber) {
    //look up the password for AWS signin
    API.graphql(
      graphqlOperation(listUsers, {
        filter: {
          username: { eq: phoneNumber }
        },
      })).then(
        response => {
          //update the user info
          const authUser = response.data.listUsers.items[0]
          //console.log('authUser', authUser)
          if (authUser) {
            signInAWSUser(phoneNumber, authUser.password)
          } else {
            setIsLoading(false)
            setErrorMsg("Hmmm, we can't find that phone number.")
          }
        },
        error => console.log('Whoops: ', error)
      )
  }

  function generatePassCode() {
    const randomString1 = Math.random().toString(36).slice(-5);
    const randomString2 = Math.random().toString(36).slice(-5).toUpperCase();
    const specialChars = "(^$*.[]{}()?-!@#%&/\,><:;|_~+=)";
    const specialChar1 = specialChars.charAt(Math.floor(Math.random() * specialChars.length))
    const specialChar2 = specialChars.charAt(Math.floor(Math.random() * specialChars.length))
    return specialChar2 + randomString1 + specialChar1 + randomString2
  }

  function cancel() {
    setIsLoading(false)
    setErrorMsg('')
    setShowSignin(false)
    setShowSignup(false)
    setShowVerify(false)
    setShowNewCode(false)
    setShowNewCodeVerify(false)
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
              bg="blue.400"
              colorScheme="blue"
              borderRadius="full"
              onPress={() => { setShowSignin(true) }}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  _dark={{
                    color: "warmGray.50",
                  }}
                  size="6"
                  name="account"
                  color="warmGray.50"
                />
              }
            />
            <Text fontSize={15} color="gray.400">Sign In</Text>

            <IconButton
              mt="4"
              variant="solid"
              bg="teal.400"
              colorScheme="teal"
              borderRadius="full"
              onPress={() => setShowSignup(true)}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name="account-plus"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />
            <Text fontSize={15} color="gray.400">Sign Up</Text>

            <IconButton
              mt="4"
              variant="solid"
              bg="green.400"
              colorScheme="green"
              borderRadius="full"
              onPress={() => setShowVerify(true)}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name="account-check"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />
            <Text fontSize={15} color="gray.400">Verify</Text>

            <IconButton
              mt="4"
              variant="solid"
              bg="yellow.400"
              colorScheme="yellow"
              borderRadius="full"
              onPress={() => setShowNewCode(true)}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name="account-question"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="warmGray.50"
                />
              }
            />
            <Text fontSize={15} color="gray.400">Resend Code</Text>
          </Stagger>
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
          opacity={1}
          py="2"
          flex={1}
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

      <Modal
        isOpen={showSignin || showSignup || showVerify || showNewCode || showNewCodeVerify}
        onClose={() => cancel()}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            {showSignin && "Sign In"}
            {showSignup && "Sign Up"}
            {showNewCode && "New Code?"}
            {(showVerify || showNewCodeVerify) && "Verify"}
          </Modal.Header>
          <Modal.Body>
            <VStack space={4} width="100%" alignItems="center">
                <Text color="gray.500" width="90%">
                {showSignin && "Hello, please sign in with your phone number."}
            {showSignup && "Welcome, please sign up with your area code & phone number."}
            {showNewCode && "Please enter your phone number to get a new code."}
            {(showVerify || showNewCodeVerify) && "Please enter the 6 digit code you received."}
                </Text>
              <FormControl width="90%">
              <Input
                      size="xl"
                      fontSize="3xl"
                      maxLength={10}
                      onChangeText={text => setPhone(text)}
                    />
              </FormControl>
              {(showVerify || showNewCodeVerify) && (
                  <FormControl width="90%">
                    <Input
                      size="xl"
                      fontSize="3xl"
                      maxLength={6}
                      onChangeText={text => setCode(text)}
                    />
                  </FormControl>
              )}
              {errorMsg.length > 0 && (
                  <Text textAlign="center" width="90%" color="rose.400">{errorMsg}</Text>
              )}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={cancel}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                mx="auto"
                onPress={handleButtonClick}
                disabled={phone.length < 10}
                opacity={(phone.length < 10) ? "20" : "100"}
              >
                {showSignin && "Sign In"}
                {showSignup && "Sign Up"}
                {showNewCode && "Send Code"}
                {(showVerify || showNewCodeVerify) && "Verify"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>

  );
}

export default connect(mapStateToProps)(ProfileAuth)