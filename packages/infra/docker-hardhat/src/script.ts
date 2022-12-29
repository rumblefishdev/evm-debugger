import * as AWS from 'aws-sdk';

const s3BucketName = process.env.HARDHAT_JSON_BASE_URL || 'hardhat.rumblefish.dev';
const txHash = process.env.TX_HASH || '0xf9db081c3eb7610283586c4002abf70e7f1de49ce681a9ff971c4ad7e26cab21';
const chainId = process.env.CHAIN_ID || 1;

;(async () => {
    try {
        console.log("TX_HASH_1:", txHash)
        const hardhat = require("hardhat")
        let hardhatProvider = await hardhat.run("node:get-provider");

        const traceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])
        const uploadedTraceResult = await uploadJson(JSON.stringify(traceResult), `trace/${chainId}/${txHash}`);
        const traceResultLocation = uploadedTraceResult.Location
        console.log("LOCATION:", traceResultLocation)
    } catch (ex) {
        console.log("err: ", ex);
    } finally {
        process.exit()
    }
})()

export const uploadJson = async (json: string, url: string) => {
    return new AWS.S3().upload({
        Key: `hardhat/${url}.json`,
        Body: json,
        Bucket: s3BucketName,
        ContentType: 'application/json',
    }).promise();
}
