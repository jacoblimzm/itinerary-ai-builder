'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel, TripParams } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Img,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';
import countries from '../public/data/countries.json';
import tripType from '../public/data/trip_type.json';
import avatar from '../public/img/avatars/1.png';

export default function Chat() {
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedTripParams, setTripParams] = useState<TripParams>({
    country: '',
    tripType: '',
    days: 1,
  });
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #8edbd7 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  console.log('apikey LoadED 1', process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  const handleTranslate = async () => {
    let apiKey =
      localStorage.getItem('apiKey') || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    console.log("apikey LoadED",apiKey);
    // setInputOnSubmit(inputCode);
    setInputOnSubmit(
      `Country: ${selectedTripParams.country} --- Type of Trip: ${selectedTripParams.tripType} --- Number of Days: ${selectedTripParams.days}`,
    );

    // Chat post conditions(maximum number of characters, valid message etc.)
    const maxCodeLength = model === 'gpt-4o' ? 700 : 700;

    if (!apiKey?.includes('sk-')) {
      alert('Please enter an API key.');
      return;
    }

    // if (!inputCode) {
    //   alert('Please enter your message.');
    //   return;
    // }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }
    setOutputCode(' ');
    setLoading(true);
    const controller = new AbortController();
    const body: ChatBody = {
      inputCode: `I am interested in taking a trip to ${selectedTripParams.country}. The type of trip I am looking for is ${selectedTripParams.tripType}. I plan to visit for ${selectedTripParams.days} days. Please provide me with a complete ${selectedTripParams.days}-day itinerary, including suggested activities, accomodation, as well as travel tips based on my criteria. The output should be in a standardised format, including an overview, the main body with at least 3 activities a day with in a list. The itinerary should also include breakfast, lunch, and dinner suggestions for each day, seperate from the suggested activities under a sub-section called 'Food' within each day. Include additional travel tips for the suggested country, and a short conclusion encouraging the person to take a break! Use smaller headings where possible to conserve view space.`,
      model,
      apiKey,
    };

    // -------------- Fetch --------------
    const response = await fetch('./api/chatAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      if (response) {
        alert(
          'Something went wrong went fetching from the API. Make sure to use a valid API key.',
        );
      }
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      setLoading(true);
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
  };
  // -------------- Copy Response --------------
  // const copyToClipboard = (text: string) => {
  //   const el = document.createElement('textarea');
  //   el.value = text;
  //   document.body.appendChild(el);
  //   el.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(el);
  // };

  // *** Initializing apiKey with .env.local value
  // useEffect(() => {
  // ENV file verison
  // const apiKeyENV = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  // if (apiKey === undefined || null) {
  //   setApiKey(apiKeyENV)
  // }
  // }, [])

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const handleTripParamChange = (Event: any) => {
    setTripParams({
      ...selectedTripParams,
      [Event.target.name]: Event.target.value,
    });
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      {/* <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      /> */}
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '100vh', '2xl': '100vh' }} // change this for the overall viewport for the right side
        maxW="1000px"
        pt="30px"
        pb="10px"
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
              w="164px"
              h="70px"
              boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-3.5-turbo')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdBolt}
                  width="20px"
                  height="20px"
                  // color={iconColor}
                  color="#4DBAB4"
                />
              </Flex>
              GPT-3.5
            </Flex>
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-4o' ? buttonBg : 'transparent'}
              w="174px"
              h="70px"
              boxShadow={model === 'gpt-4o' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-4o')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  // color={iconColor}
                  color="#4DBAB4"
                />
              </Flex>
              GPT-4o
            </Flex>
          </Flex>

          {/* <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
            <AccordionItem border="none">
              <AccordionButton
                borderBottom="0px solid"
                maxW="max-content"
                mx="auto"
                _hover={{ border: '0px solid', bg: 'none' }}
                _focus={{ border: '0px solid', bg: 'none' }}
              >
                <Box flex="1" textAlign="left">
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    No plugins added
                  </Text>
                </Box>
                <AccordionIcon color={gray} />
              </AccordionButton>
              <AccordionPanel mx="auto" w="max-content" p="0px 0px 10px 0px">
                <Text
                  color={gray}
                  fontWeight="500"
                  fontSize="sm"
                  textAlign={'center'}
                >
                  This is a cool text example.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion> */}
        </Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex w="100%" align={'center'} mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color="blackAlpha.600"
              />
            </Flex>
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
              align="right"
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {inputOnSubmit}
              </Text>
              {/* <Icon
                cursor="pointer"
                as={MdEdit}
                ms="auto"
                width="20px"
                height="20px"
                color={gray}
              /> */}
            </Flex>
          </Flex>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              // bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              bg={'#233E59'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              {/* <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              /> */}
              <Img width="30px" height="15px" src={avatar.src} />
            </Flex>
            {/* Output from Chatgpt */}
            <Box
              w="100%"
              h="calc(100vh - 380px)"
              minH="100%"
              overflowY="scroll"
            >
              <MessageBoxChat output={outputCode} />
            </Box>
          </Flex>
        </Flex>
        {/* Chat Input */}
        {/* <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleTranslate}
            isLoading={loading ? true : false}
          >
            Submit
          </Button>
        </Flex> */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
          alignItems="end"
        >
          <FormControl me="10px">
            <FormLabel>Country</FormLabel>
            <Select
              minH="54px"
              h="100%"
              borderColor={borderColor}
              borderRadius="45px"
              variant="outline"
              // placeholder="Select One"
              name="country"
              value={selectedTripParams.country}
              onChange={handleTripParamChange}
            >
              <option value="" disabled hidden>
                Select One
              </option>
              {countries.map((country) => (
                <option key={country.iso3} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl me="10px">
            <FormLabel>Type of Trip</FormLabel>
            <Select
              minH="54px"
              h="100%"
              me="10px"
              borderColor={borderColor}
              borderRadius="45px"
              variant="outline"
              // placeholder="Select One"
              name="tripType"
              value={selectedTripParams.tripType}
              onChange={handleTripParamChange}
            >
              <option value="" disabled hidden>
                Select One
              </option>
              {tripType.map((trip) => (
                <option key={trip.id} value={trip.type}>
                  {trip.type}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl me="10px">
            <FormLabel>Number of Days</FormLabel>
            <NumberInput
              // variant="outline"
              value={selectedTripParams.days}
              max={14}
              clampValueOnBlur={true}
              name="days"
              onChange={(e: any) => {
                setTripParams({ ...selectedTripParams, days: e });
              }}
            >
              <NumberInputField minH="54px" h="100%" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <Button
            // variant="primary"

            // bg="#4DBAB4"
            colorScheme="teal"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow: '0px 21px 27px -10px #4DBAB4 !important',
              bg: 'linear-gradient(15.46deg, #4DBAB4 26.3%, #8edbd7 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4DBAB4 26.3%, #8edbd7 86.4%)',
              },
            }}
            onClick={handleTranslate}
            isLoading={loading ? true : false}
          >
            Let's Go!
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="10px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            TripGPT may produce inaccurate information about people, places, or
            facts. Check important info.
          </Text>
          {/* <Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
            <Text
              fontSize="xs"
              color={textColor}
              fontWeight="500"
              textDecoration="underline"
            >
              ChatGPT May 12 Version
            </Text>
          </Link> */}
        </Flex>
      </Flex>
    </Flex>
  );
}
