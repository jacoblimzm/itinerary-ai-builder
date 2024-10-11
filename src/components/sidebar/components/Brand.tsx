'use client';
// Chakra imports
import { Flex, Img, useColorModeValue } from '@chakra-ui/react';
import { HorizonLogo } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';
import eacLogo from '../../../../public/img/layout/1.png';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Img src={eacLogo.src } />
      {/* <HorizonLogo h="26px" w="146px" my="30px" color={logoColor} /> */}
      <HSeparator mt="20px" mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
