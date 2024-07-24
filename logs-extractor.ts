import {CloudWatchLogsClient, CloudWatchLogsClientConfig, GetLogEventsCommand} from "@aws-sdk/client-cloudwatch-logs";

const region = 'us-west-2'; // Update this with your region
const client = new CloudWatchLogsClient({ region });


export async function getLogs(logGroupName: string, logStreamName: string) {
    const command = new GetLogEventsCommand({
        logGroupName,
        logStreamName,
        startFromHead: true
    });

    try {
        const data = await client.send(command)
        return data.events;
    } catch (err) {
        console.error(err);
        return null;
    }
}
