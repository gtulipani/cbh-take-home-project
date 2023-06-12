import {describe, expect, it} from '@jest/globals';

import {deterministicPartitionKey} from './dpk';

describe("deterministicPartitionKey", () => {
  it("returns the literal '0' when given no input", () => {
    expect(deterministicPartitionKey()).toBe("0");
  });

  it("sets provided partition key when not null", () => {
    const VALID_PARTITION_KEY_VALUE = "SomeValidPartitionKey";

    const keyWithProvidedPartitionKey = deterministicPartitionKey({
      partitionKey: VALID_PARTITION_KEY_VALUE
    });

    expect(keyWithProvidedPartitionKey).toBe(VALID_PARTITION_KEY_VALUE);
  });

  it("stringifies to JSON provided partition key when it's not a string", () => {
    const NUMERIC_PARTITION_KEY = 2;

    const keyWithProvidedPartitionKey = deterministicPartitionKey({
      partitionKey: NUMERIC_PARTITION_KEY
    });

    expect(keyWithProvidedPartitionKey).toBe(JSON.stringify(NUMERIC_PARTITION_KEY));
  });

  it("creates sha3-512 hash by using stringified version from provided event and encoding as hex", () => {
    const EVENT_METADATA = "some metadata";
    const EVENT_DATA = "some data";
    // Hash has been created externally using {"metadata":"some metadata","data":"some data"} as input
    const EXPECTED_HASH = "382ca4b7bb18bd2f6926e872218911f76fab4491713c6f1b9281533811765ac6e57f88718234436e9baa6c3c4135ad4633bc1c95bcb0576d78f15b9546981b4b";

    const partitionKey = deterministicPartitionKey({
      metadata: EVENT_METADATA,
      data: EVENT_DATA,
    });

    expect(partitionKey).toBe(EXPECTED_HASH);
  });

  it("creates sha3-512 hash by using the provided partition key, when it exceeds the length of 256 chars", () => {
    // Partition Key with a length of 257 chars
    const INVALID_PARTITION_KEY = "TNvckWyBwElzpZhl5ZZ3egpENSJIjJl2HScugtBwGlP0EscJ7PI5N6ltKH4qMxnM5etprKv6aNd5H7Jikg58L2bS0mmkRsPvzYZfXQRTjKl0fFNjMNmIG9LzTnFbPFSSG2ufwUnfia1D6sajQcByCawQNrgI2H9LKWHpfFKDQKSuN7mAInOfbIpjuXUZvxTnCYswUra2VR4JfyH1fNfQ1pM5ysTVKLSuSWYqLjVq6ZckJO2hWqzOGnu0Vp2Hyt3VE";
    // Hash has been created externally using INVALID_PARTITION_KEY as source
    const EXPECTED_HASH = "90a716f1814fdbaeb3440c4ef6e86e8291a0b55ca85ae39db5c23d993cebc9cc312a282244723d6767d1201172949bd28242c29d23799470063d51b06e25da7c";

    const partitionKey = deterministicPartitionKey({
      partitionKey: INVALID_PARTITION_KEY
    });

    expect(partitionKey).toBe(EXPECTED_HASH);
  });
});
