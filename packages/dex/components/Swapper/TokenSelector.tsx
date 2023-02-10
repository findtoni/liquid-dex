import { useState, useEffect, useRef, useMemo } from 'react';
import { useTokensStore } from '../../store/tokens';
import { useTradeStore } from '../../store/trade';
import {
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { TokenInfo } from '@uniswap/token-lists';
import {
  create,
  insertBatch,
  search,
  Lyra,
  PropertiesSchema,
} from '@lyrasearch/lyra';
import Image from 'next/image';

interface TokenSelectorProps {
  type: 'buy' | 'sell';
  isOpen: boolean;
  onClose: () => void;
  onReverse: () => void;
}

interface TokenSearchSchema extends PropertiesSchema {
  name: 'string';
  symbol: 'string';
  address: 'string';
}


export function TokenImage({ name, logoURI = 'https://via.placeholder.com/50' }: { name: string, logoURI: string | undefined }) {
  return (
    <Image src={logoURI?.slice(0, 4) === 'ipfs' ? logoURI?.replace('ipfs://', 'https://ipfs.io/ipfs/') : logoURI as string}
    alt={name} width={25} height={25} className="rounded" />
  );
}

function TokenItem({ token, onClick }: { token: TokenInfo, onClick: () => void }) {
  return (
    <div onClick={onClick} className="flex justify-start items-center space-x-4 rounded hover:bg-gray-200 hover:cursor-pointer">
      <TokenImage name={token?.name} logoURI={token.logoURI} />
      <div className="flex flex-col">
        <p>{token?.name}</p>
        <p className="text-sm font-medium">{token?.symbol}</p>
      </div>
    </div>
  );
}

export default function TokenSelector({ type, isOpen, onClose, onReverse }: TokenSelectorProps) {
  const { chain: activeChain, setTradeToken, isDuplicate } = useTradeStore();
  const { tokenLists, loadTokens } = useTokensStore();
  const tokenList = useMemo<TokenInfo[]>(
    //@ts-ignore
    () => tokenLists[activeChain]?.tokens,
    [tokenLists, activeChain],
  );
  const [tokensDB, setTokensDB] = useState<Lyra<TokenSearchSchema>>();
  const [searchResult, setSearchResult] = useState<TokenInfo[]>();

  useEffect(  () => {
    loadTokens();
    loadTokenSearch();
  }, []);

  function setToken(token: TokenInfo) {
    if (isDuplicate(token)) {
      onReverse();
    } else setTradeToken(type, token);
    onClose();
  }

  async function loadTokenSearch() {
    const db = await create({
      schema: {
        name: 'string',
        symbol: 'string',
        address: 'string',
      },
    });
    const docs = tokenList.map(token => {
      return { name: token.name, symbol: token.symbol, address: token.address };
    });
    await insertBatch(db, docs, { batchSize: 500 });
    setTokensDB(db);
  }

  async function searchTokens(event: React.ChangeEvent<HTMLInputElement>) {
    //@ts-ignore
    const searchResult = await search(tokensDB, {
      term: event.target.value,
      properties: '*',
    });
    const tokens = searchResult.hits.map(res => tokenList.find(token => token.symbol === res.document.symbol)) as TokenInfo[];
    setSearchResult(tokens);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        {/* @ts-ignore */}
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col space-y-3 py-2">
              <div className="flex justify-between items-center">
                <p className="m-0 p-0 text-lg font-semibold">Token Search</p>
                <ModalCloseButton />
              </div>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                </InputLeftElement>
                <Input
                  onChange={searchTokens}
                  type="text"
                  placeholder="Search by name, symbol or address"
                />
              </InputGroup> 
              <div
                className="flex flex-col space-y-2 overflow-auto h-auto pt-4"
                style={{ maxHeight: 'calc(100vh - 1rem - 81px - 50px)' }}>
                  {
                    searchResult && searchResult.length > 0
                    ? (searchResult?.map((token, index) => (
                      <TokenItem
                        token={token}
                        onClick={() => setToken(token)}
                        key={index}
                      />
                    ))) 
                    : (tokenList?.map((token, index) => (
                      <TokenItem
                        token={token}
                        onClick={() => setToken(token)}
                        key={index}
                      />
                    )))
                  }
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}