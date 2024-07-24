import {getLogs} from './logs-extractor';
import {LogsStorage} from './logs-storage';
import config from './config.json';
import {LogMessageFrequency} from "./frequency";
import {DuplicatedLog, LogsAnalyzerResult, RedundantLogPayloads, RedundantLogs} from "./logs-analyzer-result";

export async function analyze(logGroupName: string, logStreamName: string): Promise<LogsAnalyzerResult> {
    const logs = await getLogs(logGroupName, logStreamName);

    const logsStorage = new LogsStorage();

    if (logs) {
        logs.forEach(log => {
            if (log && log.message && log.message.length > 0) {
                let refinedLogMessage = refineLog(log.message);
                logsStorage.storeLogMessage(refinedLogMessage)
            }
        });
    } else {
        console.log('No logs found.');
    }

    const frequencyMap = logsStorage.getLogMessagesFrequencyMap();

    let result: LogsAnalyzerResult = {
        serviceName: logGroupName,
        report: {
            duplicatedLogs: calculateDuplicatedLogs(frequencyMap),
            redundantLogs: calculateRedundantLogs(frequencyMap),
            redundantLogPayloads: calculateRedundantLogPayloads(frequencyMap),
        }
    }

    console.log(result);
    return result;
}

function refineLog(input: string): string {
    const guidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;
    const match = input.match(guidRegex);
    if (match && match[0]) {
        const guidIndex = input.indexOf(match[0]);
        const guidLength = match[0].length;
        return input.substring(guidIndex + guidLength);
    }
    return '';
}

function calculateRedundantLogs(frequencyMap: Map<string, LogMessageFrequency>): RedundantLogs {
    let redundantLogs: RedundantLogs = {logs: [], count: 0};

    let messageSet = new Set<string>();
    frequencyMap.forEach((value, key) => {
        if (value && value.sameSuffixCount > config.searchParams.samePrefixOrSuffixThreshold
            || value.samePrefixCount > config.searchParams.samePrefixOrSuffixThreshold) {

            messageSet.add(value.message);
            value.sameMessages.forEach(message => {
                messageSet.add(message);
            });
        }

        redundantLogs.logs = Array.from(messageSet);
        redundantLogs.count = messageSet.size;
    });

    return redundantLogs;
}


function calculateDuplicatedLogs(frequencyMap: Map<string, LogMessageFrequency>): DuplicatedLog[] {
    let duplicatedLogs: DuplicatedLog[] = [];

    frequencyMap.forEach((value, key) => {
        if (value && value.duplicateCount > 0) {
            duplicatedLogs.push({
                value: value.message,
                count: value.duplicateCount
            });
        }
    });

    return duplicatedLogs;
}

function calculateRedundantLogPayloads(frequencyMap: Map<string, LogMessageFrequency>): RedundantLogPayloads {
    let redundantPayload: RedundantLogPayloads = {logs: [], count: 0};

    let messageSet = new Set<string>();
    frequencyMap.forEach((value, key) => {
        if (value && value.size > config.searchParams.messageSizeThreshold) {
            messageSet.add(value.message);
            value.sameMessages.forEach(message => {
                messageSet.add(message);
            });

        }

        if (messageContainsErrorStackTrace(value.message)) {
            messageSet.add(value.message);
        }
    });

    redundantPayload.logs = Array.from(messageSet);
    redundantPayload.count = messageSet.size;

    return redundantPayload;
}

function messageContainsErrorStackTrace(message: string): boolean {
    const splitArray = message.split(" at ");
    return splitArray.length > config.searchParams.stackTraceIndicator;
}


// Run the analysis

// analyze("/aws/lambda/test-lambda-hybrid-recording-screen", "2024/07/23/[$LATEST]c55e21ab8c3c4378805ba11874e2abd5")
//     .catch(console.error);
