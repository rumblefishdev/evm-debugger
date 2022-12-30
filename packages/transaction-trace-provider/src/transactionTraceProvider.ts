import * as AWS from 'aws-sdk';
import {TASK_NODE_GET_PROVIDER} from "hardhat/builtin-tasks/task-names";

const s3BucketName = process.env.HARDHAT_JSON_BASE_URL;
const txHash = process.env.TX_HASH;
const chainId = process.env.CHAIN_ID;

const main = async () => {
    try {
        const hardhat = require("hardhat")

        let hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER);
        const traceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])
        await uploadJson(JSON.stringify(traceResult), `transactionTrace/${chainId}/${txHash}`);
    } catch (ex) {
        console.log("err: ", ex);
        process.exit(1)
    } finally {
        process.exit()
    }
}
void main()

export const uploadJson = async (json: string, url: string) => {
    return new AWS.S3().upload({
        Key: `${url}.json`,
        Body: json,
        Bucket: s3BucketName,
        ContentType: 'application/json',
    }).promise();
}
