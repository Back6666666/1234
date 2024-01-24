import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the next token ID to be minted from the ERC721 contract.
 * @param contract - The ERC721 contract instance.
 * @returns A promise that resolves to the next token ID to be minted.
 */
export async function nextTokenIdToMint<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  const [opts] = extractTXOpts(options);
  return read({
    ...opts,
    method: "function nextTokenIdToMint() view returns (uint256)",
  });
}
