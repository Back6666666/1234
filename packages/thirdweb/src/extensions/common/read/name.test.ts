import { describe, it, expect, vi, afterEach } from "vitest";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { name } from "./name.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("shared.name", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should respond with the correct value", async () => {
    const S = await name({
      contract: USDC_CONTRACT,
    });
    expect(S).toBe("USD Coin");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
  it("should cache the value for the same contract", async () => {
    // we do this because otherwise we hit the cache from the prior test-run (weak map is global)
    const CLONED_USDC = { ...USDC_CONTRACT };
    const S1 = await name({
      contract: CLONED_USDC,
    });
    expect(S1).toBe("USD Coin");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const S2 = await name({
      contract: CLONED_USDC,
    });
    expect(S2).toBe("USD Coin");
    // it should still only have been called once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
