import * as AWS from 'aws-sdk';
import {TASK_NODE_GET_PROVIDER} from "hardhat/builtin-tasks/task-names";

const s3BucketName = process.env.HARDHAT_JSON_BASE_URL || 'hardhat.rumblefish.dev';
const txHash = process.env.TX_HASH || '0xf9db081c3eb7610283586c4002abf70e7f1de49ce681a9ff971c4ad7e26cab21';
const chainId = process.env.CHAIN_ID || 1;

;(async () => {
    try {
        const hardhat = require("hardhat")

        let hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER);
        const traceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])
        await uploadJson(JSON.stringify(traceResult), `trace/${chainId}/${txHash}`);
    } catch (ex) {
        console.log("err: ", ex);
        process.exit(1)
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
