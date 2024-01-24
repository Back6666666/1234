import { decodeFunctionResult } from "../../abi/decode.js";
import type { AbiFunction, AbiParametersToPrimitiveTypes } from "abitype";
import {
  transaction,
  type Transaction,
  type TransactionOptions,
} from "../transaction.js";
import { getRpcClient } from "../../rpc/index.js";

import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/index.js";

export async function read<
  client extends ThirdwebClient | ThirdwebContract,
  method extends AbiFunction | string,
>(options: TransactionOptions<client, method>) {
  return readTx(transaction(options));
}

export async function readTx<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
): Promise<
  // if the outputs are 0 length, return never, invalid case
  abiFn["outputs"] extends { length: 0 }
    ? never
    : abiFn["outputs"] extends { length: 1 }
      ? // if the outputs are 1 length, we'll always return the first element
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>[0]
      : // otherwise we'll return the array
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>
> {
  if (!tx._encoded) {
    // import the encode function only when it is needed
    const { encode } = await import("./encode.js");

    tx._encoded = encode(tx);
  }

  const [encodedData, resolvedAbi] = await Promise.all([tx._encoded, tx.abi()]);
  if (!resolvedAbi) {
    throw new Error("Unable to resolve ABI");
  }

  const rpcRequest = getRpcClient(tx.client, { chainId: tx.chainId });
  const result = await rpcRequest({
    method: "eth_call",
    params: [
      {
        to: tx.contractAddress,
        data: encodedData,
      },
      "latest",
    ],
  });

  const decoded = decodeFunctionResult(resolvedAbi, result);

  if (Array.isArray(decoded) && decoded.length === 1) {
    return decoded[0];
  }

  // @ts-expect-error - not sure why this complains but it works fine
  return decoded;
}
