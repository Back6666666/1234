import type { Abi } from "abitype";

const ABI_CACHE = /*#__PURE__*/ new Map<string, Promise<Abi>>();

export async function resolveAbi(input: {
  chainId: number;
  contractAddress: string;
}): Promise<Abi> {
  const { contractAddress, chainId } = input;
  const key = `${chainId}:${contractAddress}`;
  if (ABI_CACHE.has(key)) {
    return (await ABI_CACHE.get(key)) as Abi;
  }
  const abi = fetchAbi(input);
  ABI_CACHE.set(key, abi);
  return await abi;
}

const CONTRACT_RESOLVER_BASE_URL = "https://contract.thirdweb.com/metadata";

// TODO obviously this has to be a lot more robust
async function fetchAbi(input: {
  chainId: number;
  contractAddress: string;
}): Promise<Abi> {
  const response = await fetch(
    `${CONTRACT_RESOLVER_BASE_URL}/${input.chainId}/${input.contractAddress}`,
  );
  const json = await response.json();
  // abi is in json.output.abi
  return json.output.abi as Abi;
}
