import { VStack, Text, HStack, Box, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { InfoBarbox, PageHeader } from '../components/common';
import Dashboard from '../components/dashboard';
import {
  CloudUploadIcon,
  JobSubmitIcon,
  LearnBookIcon,
  LookingGlassChartIcon,
  PadLockOpenIcon,
  TerminalGraphIcon,
} from '../components/icons-library';

export default function Home({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel="Home" introduction="Welcome to Speechmatics’ SaaS Portal" />
      <VStack spacing='2em' width='800px'>
        <InfoBarbox
          width="100%"
          bgColor="smBlue.500"
          icon={<TerminalGraphIcon />}
          title="Transcribe an Audio File"
          description=""
          buttonLabel="Get Started"
          hrefUrl="/getting-started/"
        />
        <HStack alignItems="flex-start" spacing="2em">
          <HomeWhiteBox
            icon={<PadLockOpenIcon />}
            title="Manage API Keys"
            description="You need to create an API key to make API requests."
            buttonLabel="Create API Key"
            hrefUrl="/manage-access/"
          />
          <HomeWhiteBox
            icon={<LookingGlassChartIcon />}
            title="Track Your Usage"
            description="Usage is measured in hours of audio processed."
            buttonLabel="View Usage"
            hrefUrl="/usage/"
          />
          <HomeWhiteBox
            icon={<LearnBookIcon />}
            title="Learning Resources"
            description="Explore our documentation and learning resources."
            buttonLabel="Learn"
            hrefUrl="/learn/"
          />
        </HStack>
      </VStack>
    </Dashboard>
  );
}

const HomeBox = ({ bgColor, icon, iconPadding = '24px', text, buttonLabel, hrefUrl }) => {
  return (
    <VStack width="100%" height="288px" bg={bgColor} borderRadius="2px" p="1.5em" spacing="1em">
      <Box borderRadius={'100%'} width="88px" height="88px" bg="smWhite.150" p={iconPadding}>
        {icon}
      </Box>
      <Text
        fontFamily="RMNeue-Bold"
        fontSize="1.5em"
        lineHeight="1.2em"
        textAlign="center"
        color="smWhite.500"
        paddingX="1.8em"
      >
        {text}
      </Text>
      <Link href={hrefUrl}>
        <Button variant="speechmaticsWhite" color={bgColor}>
          {buttonLabel}
        </Button>
      </Link>
    </VStack>
  );
};

const HomeWhiteBox = ({ icon, title, description, buttonLabel, hrefUrl }) => {
  return (
    <VStack
      className="sm_panel"
      width="100%"
      height="278px"
      alignItems="center"
      padding="2em"
      justifyContent="space-between"
    >
      <VStack>
        <Box>{icon}</Box>
        <Text as="div" fontFamily="RMNeue-Bold" fontSize="1.1em" textAlign="center">
          {title}
        </Text>
        <Text
          as="div"
          fontFamily="RMNeue-Regular"
          fontSize="0.8em"
          color="smBlack.400"
          textAlign="center"
        >
          {description}
        </Text>
      </VStack>
      <Link href={hrefUrl}>
        <Button variant="speechmaticsOutline" width="100%">
          {buttonLabel}
        </Button>
      </Link>
    </VStack>
  );
};
