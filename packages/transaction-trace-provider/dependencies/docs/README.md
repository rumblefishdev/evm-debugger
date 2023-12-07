# Transaction Trace Provider Dependencies

This package contains patched HardHat dependencies for the transaction trace provider.
This package is deployed as a [AWS Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/packaging-layers.html).

## HardHat Patch Explanation

HardHat using `sendBatch` function to send batch of requests to the Ethereum node.
Alhemy node sometimes returns 429 error code in one of items, even when whole request has 200 status code.

HardHat doesn't want to handle this case, because it's not a HardHat bug.
So we need to patch HardHat `sendBatch` function to handle this case.

More about this issue: [link](https://github.com/NomicFoundation/hardhat/issues/3501)
Read from `Rate limiting error when using HttpProvider.sendBatch(..) method`

## How to update dependencies
1. Clone HardHat repository
  ```bash
  git@github.com:NomicFoundation/hardhat.git
  ```

2. Checkout to the latest release tag
  ```bash
  git checkout hardhat@2.19.2
  ```

3. Install dependencies using HardHat [CONTRIBUTING.md](https://github.com/NomicFoundation/hardhat/blob/main/CONTRIBUTING.md) guide
  ```bash
  pnpm i
  ```

4. Go to file `hardhat/packages/hardhat-core/src/internal/core/providers/http.ts`

5. Find function `sendBatch` and add update part it with the following code. This code was created based on [hardhat@2.19.1](https://github.com/NomicFoundation/hardhat/blob/hardhat%402.19.1/packages/hardhat-core/src/internal/core/providers/http.ts) version. Future versions may have different code, so you need to check it.

  ```typescript
  public async sendBatch(
    batch: Array<{ method: string; params: any[] }>
  ): Promise<any[]> {
    // We create the errors here to capture the stack traces at this point,
    // the async call that follows would probably loose of the stack trace
    const stackSavingError = new ProviderError("HttpProviderError", -1);

    // we need this to sort the responses
    const idToIndexMap: Record<string, number> = {};

    const requests = batch.map((r, i) => {
      const jsonRpcRequest = this._getJsonRpcRequest(r.method, r.params);
      idToIndexMap[jsonRpcRequest.id] = i;
      return jsonRpcRequest;
    });

    <!-- Patch Start -->
    let jsonRpcResponses;
    let retryNumber = 0;
    const seconds = 1;
    let needsToRetry = false;

    do {
      if (retryNumber > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
      }
      jsonRpcResponses = await this._fetchJsonRpcResponse(requests);
      needsToRetry = false;

      for (const response of jsonRpcResponses) {
        if (isErrorResponse(response)) {
          const error = new ProviderError(
            response.error.message,
            response.error.code,
            stackSavingError
          );
          error.data = response.error.data;

          if (response.error.code === 429) {
            needsToRetry = true;
          } else {
            // eslint-disable-next-line @nomicfoundation/hardhat-internal-rules/only-hardhat-error
            throw error;
          }
        }
      }
    } while (needsToRetry && this._shouldRetry(++retryNumber, seconds));
    if (needsToRetry) {
      // eslint-disable-next-line @nomicfoundation/hardhat-internal-rules/only-hardhat-error
      throw new ProviderError(
        `Too Many Requests error received from ${this._url}`,
        429, // Limit exceeded according to EIP1474
        stackSavingError
      );
    }
    <!-- Patch End -->

    // We already know that it has this type, but TS can't infer it.
    const responses = jsonRpcResponses as SuccessfulJsonRpcResponse[];

    // we use the id to sort the responses so that they match the order of the requests
    const sortedResponses = responses
      .map(
        (response) =>
          [idToIndexMap[response.id], response.result] as [number, any]
      )
      .sort(([indexA], [indexB]) => indexA - indexB)
      .map(([, result]) => result);

    return sortedResponses;
  }
  ```

  6. Run `pnpm run build` to build HardHat
  7. Copy file from HardHat
  ```bash
  hardhat/packages/hardhat-core/internal/core/providers/http.js
  ```
  to evm-debugger
  ```bash
  evm-debugger/packages/transaction-trace-provider/dependencies/nodejs/patches/node_modules/hardhat/internal/core/providers/http.js
  ```

## Patch Test
  1. This bug can be reproduced on machines close to the Alchemy servers (due to small latency which increasing 429 error in single item), so you need to setup EC2 instance in the USA.

  2. Install nodejs via nvm in version which is currently used in our project.

  3. Copy current patches directory to hardhat-update-test directory
  ```bash
  cp -r packages/transaction-trace-provider/dependencies/nodejs/patches packages/transaction-trace-provider/dependencies/docs/hardhat-update-test/patches
  ```
  4. Add `.env` file with Alchemy API key to `hardhat-update-test` directory

  5. Copy whole `hardhat-update-test` directory to EC2 instance
  6. Install dependencies
  ```bash
  cd hardhat-update-test
  nvm use <version>
  npm install
  ```
  7. Run test before patching
  ```bash
  npm run debug
  ```
  8. Run test after patching
  ```bash
  npm run patch
  npm run debug
  ```

  9. If it's working correctly, then you can commit update patches directory to the evm-debugger repository.
