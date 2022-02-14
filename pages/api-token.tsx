import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Tooltip,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { makeObservable, observable, computed, action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, useMemo, useRef, useContext } from 'react';
import Dashboard from '../components/dashboard';
import { IoTrashBinOutline, IoCopyOutline } from 'react-icons/io5';
import accountContext, { ApiKey } from '../utils/account-context';
import { callPostApiKey } from '../utils/call-api';

export default function GetAccessToken({ }) {


  return (
    <Dashboard>
      <h1>API Token</h1>
      <div className="token_form">
        <div className="description_text">
          You need an API Key (also known as an Authorization Token) to make calls to our REST API.
          See our{' '}
          <a
            target="_blank"
            href="https://docs.speechmatics.com"
            style={{ textDecoration: 'underline' }}
          >
            documentation
          </a>{' '}
          to find out how to make API calls.
        </div>

        <GenerateTokenCompo />

        <PreviousTokens />
      </div>
    </Dashboard>
  );
}



const GenerateTokenCompo = observer(() => {
  const [genTokenStage, setGenTokenStage] = useState<
    'init' | 'inputName' | 'waiting' | 'generated'
  >('init');

  const [chosenTokenName, setChosenTokenName] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [noNameError, setNoNameError] = useState(false);

  const { accountStore, tokenStore } = useContext(accountContext);
  const apiKeys = accountStore.getApiKeys();
  const idToken = tokenStore.tokenPayload?.idToken;

  const nameInputRef = useRef(null);

  const requestToken = useCallback(() => {
    if (nameInputRef?.current?.value == '') {
      setNoNameError(true);
    } else {
      setNoNameError(false);

      setGenTokenStage('waiting');
      callPostApiKey(idToken, chosenTokenName).then((resp) => {
        setGeneratedToken(resp.apikey_id);
        setGenTokenStage('generated');
        accountStore.fetchServerState(idToken);
      });
    }
  }, [nameInputRef?.current?.value, idToken, chosenTokenName]);

  return (
    <section>
      {genTokenStage == 'init' && (
        <HStack>
          {apiKeys?.length >= 5 && (
            <Text>You already have 5 tokens, remove one before requesting new.</Text>
          )}
          <Button
            className="default_button"
            disabled={apiKeys?.length >= 5}
            onClick={() => setGenTokenStage('inputName')}
          >
            Generate new token
          </Button>
        </HStack>
      )}
      {genTokenStage == 'inputName' && (
        <HStack>
          <input
            type="text"
            placeholder="your token's name here"
            onChange={(ev) => setChosenTokenName(ev.target.value)}
            style={{ border: noNameError ? '1px solid red' : '' }}
            ref={nameInputRef}
          ></input>
          <Button className="default_button" onClick={() => requestToken()}>
            Ok
          </Button>
        </HStack>
      )}
      {genTokenStage == 'waiting' && (
        <HStack>
          <Box>
            Sending request for Your "{chosenTokenName}" token. Please do hold on for a second or
            two...
          </Box>
          <Spinner size="md" />
        </HStack>
      )}
      {genTokenStage == 'generated' && (
        <VStack alignItems="flex-start">
          <Box>All good! Your new token is:</Box>
          <Box fontSize={22} padding="20px 0px">
            {generatedToken}
            <Tooltip label="copy" placement="right">
              <IconButton
                className="default_button"
                aria-label="copy"
                marginLeft={10}
                icon={<IoCopyOutline />}
                color="#bbb"
                backgroundColor="#fff"
                padding={5}
                onClick={() => {
                  navigator?.clipboard?.writeText(generatedToken);
                }}
                _hover={{ color: '#fff', backgroundColor: 'var(--main-navy)' }}
              />
            </Tooltip>
          </Box>
          <Box>
            Please copy it.{' '}
            <Text as="span" color="#D72F3F">
              You will see this token only once.
            </Text>
          </Box>
          <HStack>
            <Button className="default_button" onClick={() => setGenTokenStage('init')}>
              Great!
            </Button>
          </HStack>
        </VStack>
      )}
    </section>
  );
});

const PreviousTokens = observer(() => {
  const [tokenIdToRemove, setIdTokenToRemove] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { accountStore, tokenStore } = useContext(accountContext);
  const apiKeys = accountStore.getApiKeys();
  const idToken = tokenStore.tokenPayload?.idToken;

  const aboutToRemoveOne = (el: ApiKey) => {
    console.log('aboutToRemoveOne', el, el.apikey_id);
    setIdTokenToRemove(el.apikey_id);
    onOpen();
  };

  const onRemoveConfirm = () => {
    console.log('aboutToRemoveOne', tokenIdToRemove);
    accountStore.removeApiKey(idToken, tokenIdToRemove);
    onClose();
  };

  return (
    <section>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>Remove the token "{tokenIdToRemove}"?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onRemoveConfirm}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <h2 style={{ marginTop: '70px' }}>Previous tokens:</h2>
      <VStack alignItems="stretch" marginRight="25%">
        {apiKeys?.map((el: ApiKey, index) => (
          <HStack justifyContent="stretch" key={index}>
            <Box flex="1">
              <Tooltip label={`(token's id ${el.apikey_id})`} placement="right">
                {el.apikey_id.slice(0, 15)}
              </Tooltip>
            </Box>
            <Box flex="1">
              <Tooltip label="(token's name)" placement="right">
                {el.name}
              </Tooltip>
            </Box>
            <Box flex="1" noOfLines={1}>
              <Tooltip label={`date created: ${new Date(el.created_at)}`} placement="right">
                {new Date(el.created_at).toUTCString()}
              </Tooltip>
            </Box>
            <Tooltip label="remove" placement="left">
              <IconButton
                className="default_button"
                aria-label="remove"
                style={{ padding: 10, backgroundColor: '' }}
                icon={<IoTrashBinOutline />}
                onClick={() => aboutToRemoveOne(el)}
              />
            </Tooltip>
          </HStack>
        ))}
      </VStack>
    </section>
  );
});

interface Token {
  dateCreated: string;
  dateLastUsed: string;
  name: string;
}

class TokenStore {
  tokens: Token[] = [
    { dateCreated: 'Last Friday', dateLastUsed: 'Last Saturday', name: 'Alpha key' },
    { dateCreated: 'Last Monday', dateLastUsed: 'Yesterday', name: 'Beta key' },
    { dateCreated: '03/03/2021', dateLastUsed: 'Saturday', name: 'Gamma key' },
  ];

  constructor() {
    makeObservable(this, {
      removeOne: action,
      addOne: action,
      tokens: observable,
    });
  }

  removeOne(tokenToRemove: Token) {
    this.tokens = this.tokens.filter((token: Token) => token.name != tokenToRemove.name);
  }

  addOne(name: string) {
    if (this.tokens.length >= 5) {
      console.log("can't test add");
      return;
    }
    this.tokens.push({ dateCreated: 'today', dateLastUsed: 'not used yet', name });
  }
}
