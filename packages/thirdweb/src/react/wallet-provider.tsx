import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { fakeUuid } from "src/utils/uuid.js";
import type { IWallet } from "../wallets/interfaces/wallet.js";

export type WalletWithId = IWallet<any> & { _id: string };

type WalletContext = {
  activeWallet: WalletWithId | null;
  connectedWallets: WalletWithId[];
  connectWallet: (wallet: WalletWithId) => void;
  activateWallet: (wallet: WalletWithId) => void;
  disconnectWallet: (wallet: WalletWithId) => void;
};

const WalletContext = /* @__PURE__ */ createContext({} as WalletContext);

export const WallerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [walletState, setWalletState] = useState<{
    activeWalletId: string | null;
    walletRecord: Map<string, WalletWithId>;
    walletIds: Set<string>;
  }>({
    activeWalletId: null,
    walletRecord: new Map(),
    walletIds: new Set(),
  });

  const activateWallet = useCallback((wallet: WalletWithId) => {
    setWalletState((prev) => ({ ...prev, activeWalletId: wallet._id }));
  }, []);

  const connectWallet = useCallback((wallet: WalletWithId) => {
    setWalletState((prev) => {
      return {
        ...prev,
        walletRecord: prev.walletRecord.set(wallet._id, wallet),
        walletIds: prev.walletIds.add(wallet._id),
        activeWalletId: wallet._id,
      };
    });
  }, []);

  const disconnectWallet = useCallback((wallet: WalletWithId) => {
    setWalletState((prev) => {
      const walletRecord = new Map(prev.walletRecord);
      walletRecord.delete(wallet._id);
      const walletIds = new Set(prev.walletIds);
      walletIds.delete(wallet._id);
      const nextWalletId = [...walletIds][0] || null;
      return {
        ...prev,
        walletRecord,
        walletIds,
        activeWalletId: nextWalletId,
      };
    });
  }, []);

  const activeWallet = useMemo(() => {
    const { activeWalletId, walletRecord } = walletState;
    return activeWalletId ? walletRecord.get(activeWalletId) || null : null;
  }, [walletState]);

  const connectedWallets = useMemo(() => {
    const { walletIds, walletRecord } = walletState;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [...walletIds].map((id) => walletRecord.get(id)!);
  }, [walletState]);

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        activateWallet,
        disconnectWallet,
        activeWallet,
        connectedWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

//hooks

export function useActiveWallet() {
  return useContext(WalletContext).activeWallet;
}

export function useActiveWalletAddress() {
  const activeWallet = useActiveWallet();
  return activeWallet?.address || null;
}

export function useConnectedWallets() {
  return useContext(WalletContext).connectedWallets;
}

export function useSetActiveWallet() {
  const { activateWallet } = useContext(WalletContext);
  return activateWallet;
}

export function useConnect() {
  const { connectWallet } = useContext(WalletContext);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(
    async function <T>(options: IWallet<T> | (() => Promise<IWallet<T>>)) {
      // reset error state
      setError(null);
      if (typeof options !== "function") {
        const walletWithId = options as WalletWithId;
        walletWithId._id = fakeUuid();
        connectWallet(walletWithId);
        return walletWithId as IWallet<T>;
      }

      setIsConnecting(true);
      try {
        const wallet = await options();
        // add the uuid for this wallet
        const walletWithId = wallet as WalletWithId;
        walletWithId._id = fakeUuid();
        connectWallet(walletWithId);
        return walletWithId as IWallet<T>;
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [connectWallet],
  );

  return { connect, isConnecting, error } as const;
}
