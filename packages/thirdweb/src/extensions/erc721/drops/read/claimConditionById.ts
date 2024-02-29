import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
/**
 * Represents the parameters for retrieving a claim condition by its ID.
 */
type GetClaimConditionByIdParams = { conditionId: bigint };

/**
 * Retrieves the claim condition by its ID.
 * @param options The transaction options.
 * @returns A promise that resolves to the claim condition.
 * @extension
 * @example
 * ```ts
 * import { getClaimConditionById } from "thirdweb/extensions/erc721";
 * const claimCondition = await getClaimConditionById({
 *  contract,
 *  conditionId: 1n,
 * });
 */
export async function getClaimConditionById(
  options: BaseTransactionOptions<GetClaimConditionByIdParams>,
) {
  return readContract({
    ...options,
    method: [
  "0x6f8934f4",
  [
    {
      "internalType": "uint256",
      "name": "_conditionId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxClaimableSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "supplyClaimed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantityLimitPerWallet",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "merkleRoot",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "pricePerToken",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "metadata",
          "type": "string"
        }
      ],
      "internalType": "struct IClaimCondition.ClaimCondition",
      "name": "condition",
      "type": "tuple"
    }
  ]
],
    params: [options.conditionId],
  });
}
