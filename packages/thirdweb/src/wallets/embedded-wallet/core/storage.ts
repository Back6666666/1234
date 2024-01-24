import type { AuthUserType } from "./authentication.type.js";
import type {
  EncryptionType,
  LoadKeyType,
  LoadKeyValueType,
  SaveKeyType,
  SaveKeyValueType,
  StorageType,
  WalletStorageFormatType,
} from "./storage.type.js";
import type { WalletDetailType } from "./wallet.type.js";

/** Sends an encrypted share / key to thirdweb for storage
 * @throws if developer is not on thirdweb managed storage
 */
export const saveEncryptedInThirdweb = (arg: {
  encryptValue: EncryptionType;
}): SaveKeyType => {
  return async ({ walletDetail, uniqueId, keyMaterial, authUser }) => {
    const { ROUTE_STORAGE_ENCRYPTED } = await import("./routes.js");
    const { StorageError } = await import("./storage.error.js");

    const secretKey = walletDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to save the key material with thirdweb",
      );
    }

    const encrypted = await arg.encryptValue({ value: keyMaterial });
    if (encrypted === keyMaterial) {
      throw new StorageError(
        "Invalid encryption. The encrypted value must not be the same as the original value",
      );
    }

    const saveResp = await fetch(ROUTE_STORAGE_ENCRYPTED(), {
      method: "POST",
      headers: {
        "x-secret-key": secretKey ?? "",
        "x-auth-user-token": authUser?.authToken ?? "",
      },
      body: JSON.stringify({
        // TODO: figure out what goes here
        // walletId: walletDetail.,
        uniqueId,
        encrypted,
      }),
    });
    if (!saveResp.ok) {
      throw new StorageError(
        "Failed to save encrypted key material to thirdweb.",
      );
    }
  };
};

/**
 * Sends a share to thirdweb unedited
 * @throws if used with format === "privateKey"
 * @throws if developer is not on thirdweb managed storage
 */
export const saveInThirdweb = (): SaveKeyType => {
  return async ({ walletDetail, uniqueId, keyMaterial, authUser }) => {
    const { ROUTE_STORAGE_BASIC } = await import("./routes.js");
    const { StorageError } = await import("./storage.error.js");

    const secretKey = walletDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to save the key material with thirdweb",
      );
    }

    if (walletDetail.format === "privateKey") {
      throw new StorageError(
        "Invalid storage format. format must be 'sharded' to use saveInThirdweb",
      );
    }

    const saveResp = await fetch(ROUTE_STORAGE_BASIC(), {
      method: "POST",
      headers: {
        "x-secret-key": secretKey ?? "",
        "x-auth-user-token": authUser?.authToken ?? "",
      },
      body: JSON.stringify({
        // walletId: walletDetail.,
        uniqueId,
        keyMaterial,
      }),
    });
    if (!saveResp.ok) {
      throw new StorageError(
        "Failed to save encrypted key material to thirdweb.",
      );
    }
  };
};

/**
 * Sends a key material to a key value store
 * @param preStore - a function to be called before the key is saved. This is useful performing any checks before the storage happens. Throw to abort the storage.
 * @param setItem - a function to be called to save the key, value pair.
 */
export const saveInKeyValueStore = (arg: {
  preSave?: (args: {
    walletDetail: WalletDetailType;
    authUser: AuthUserType | undefined;
  }) => Promise<void> | void;
  saveItem: SaveKeyValueType;
}): SaveKeyType => {
  return async ({ uniqueId, keyMaterial, walletDetail, authUser }) => {
    await arg.preSave?.({ walletDetail, authUser });
    await arg.saveItem({
      key: uniqueId,
      value: keyMaterial,
    });
  };
};

/**
 * Gets an encrypted key material from thirdweb to be decrypted
 * @throws if dev is not on managed storage
 */
export const loadEncryptedFromThirdweb = (arg: {
  decryptValue: EncryptionType;
}): LoadKeyType => {
  return async ({ walletDetail, authUser }) => {
    const { ROUTE_STORAGE_ENCRYPTED } = await import("./routes.js");
    const { StorageError } = await import("./storage.error.js");

    const secretKey = walletDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to load the key material from thirdweb",
      );
    }

    const encryptedKeyMaterialResp = await fetch(ROUTE_STORAGE_ENCRYPTED(), {
      method: "GET",
      headers: {
        "x-secret-key": secretKey ?? "",
        "x-auth-user-token": authUser?.authToken ?? "",
      },
    });
    if (!encryptedKeyMaterialResp.ok) {
      throw new StorageError(
        "Failed to get encrypted key material from thirdweb.",
      );
    }
    const { encryptedKeyMaterial }: { encryptedKeyMaterial: string } =
      await encryptedKeyMaterialResp.json();
    return await arg.decryptValue({ value: encryptedKeyMaterial });
  };
};

/**
 * Grabs a key material to thirdweb
 * @throws if used with getPrivateKey
 * @throws if dev is not on managed storage
 */
export const loadFromThirdweb = (): LoadKeyType => {
  return async ({ walletDetail, authUser }) => {
    const { ROUTE_STORAGE_BASIC } = await import("./routes.js");
    const { StorageError } = await import("./storage.error.js");

    const secretKey = walletDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to load the key material from thirdweb",
      );
    }

    if (walletDetail.format === "privateKey") {
      throw new StorageError(
        "Invalid storage format. format must be 'sharded' to use loadFromThirdweb",
      );
    }

    const keyMaterialResp = await fetch(ROUTE_STORAGE_BASIC(), {
      method: "GET",
      headers: {
        "x-secret-key": secretKey ?? "",
        "x-auth-user-token": authUser?.authToken ?? "",
      },
    });

    if (!keyMaterialResp.ok) {
      throw new StorageError("Failed to get key material from thirdweb.");
    }
    const { keyMaterial }: { keyMaterial: string } =
      await keyMaterialResp.json();
    return keyMaterial;
  };
};

/**
 * Load the key material from a key value store
 */
export const LoadFromKeyValueStore = (arg: {
  preLoad?: (args: {
    walletDetail: WalletDetailType;
    authUser: AuthUserType | undefined;
  }) => Promise<void> | void;
  loadItem: LoadKeyValueType;
}): LoadKeyType => {
  return async ({ uniqueId, walletDetail, authUser }) => {
    await arg.preLoad?.({ walletDetail, authUser });
    return await arg.loadItem({
      key: uniqueId,
    });
  };
};

export const createManagedStorage = (arg: {
  authUser?: AuthUserType;
  format: WalletStorageFormatType;
  encryptValue: EncryptionType;
  decryptValue: EncryptionType;
  saveKeyValue: SaveKeyValueType;
  loadKeyValue: LoadKeyValueType;
}): StorageType => {
  switch (arg.format) {
    case "privateKey": {
      return {
        format: "privateKey",
        save: saveEncryptedInThirdweb({
          encryptValue: arg.encryptValue,
        }),
        load: loadEncryptedFromThirdweb({
          decryptValue: arg.decryptValue,
        }),
      };
    }
    case "sharded": {
      return {
        format: "sharded",
        shareA: {
          save: saveInKeyValueStore({
            saveItem: arg.saveKeyValue,
          }),
          load: LoadFromKeyValueStore({
            loadItem: arg.loadKeyValue,
          }),
        },
        shareB: {
          save: saveEncryptedInThirdweb({
            encryptValue: arg.encryptValue,
          }),
          load: loadEncryptedFromThirdweb({
            decryptValue: arg.decryptValue,
          }),
        },
        shareC: {
          save: saveInThirdweb(),
          load: loadFromThirdweb(),
        },
      };
    }
  }
};
