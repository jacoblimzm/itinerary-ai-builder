import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import remarkGfm from 'remark-gfm';
import { useColorModeValue } from '@chakra-ui/react';
import Card from '@/components/card/Card';

export default function MessageBox(props: { output: string }) {
  const { output } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  return (
    <Card
      display={output ? 'flex' : 'none'}
      px="22px !important"
      pl="22px !important"
      color={textColor}
      minH="400px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={ChakraUIRenderer()}
      >
        {output ? output : ''}
        {/* #### Hello, *world* A paragraph with *emphasis* and **strong importance**. */}
      </ReactMarkdown>
    </Card>
  );
}
