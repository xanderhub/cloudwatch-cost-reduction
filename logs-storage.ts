import {LogMessageFrequency} from "./frequency";
import config from './config.json';

export class LogsStorage {

    private readonly frequencyMap: Map<string, LogMessageFrequency>;
    private readonly prefixLength: number = config.searchParams.prefixLength;
    private readonly suffixLength: number = config.searchParams.suffixLength
    private readonly minMessageLength: number = config.searchParams.minMessageLength;


    constructor() {
        this.frequencyMap = new Map<string, LogMessageFrequency>();
    }

    public storeLogMessage(message: string): void {
        if (message.length < this.minMessageLength || !message.trim()) {
            return;
        }

        const messagePrefix: string = this.getMessagePrefix(message);
        const messageSuffix: string = this.getMessageSuffix(message);

        const messageFoundByPrefix: LogMessageFrequency = this.frequencyMap.get(messagePrefix);
        const messageFoundBySuffix: LogMessageFrequency = this.frequencyMap.get(messageSuffix);

        if (messageFoundByPrefix && messageFoundBySuffix) {
            messageFoundByPrefix.duplicateCount++;
            messageFoundByPrefix.sameMessages.push(message);
        }
        else if (messageFoundByPrefix) {
            messageFoundByPrefix.samePrefixCount++;
            messageFoundByPrefix.sameMessages.push(message);
        }
        else if (messageFoundBySuffix) {
            messageFoundBySuffix.sameSuffixCount++;
            messageFoundBySuffix.sameMessages.push(message);
        }
        else {
            this.frequencyMap.set(messagePrefix,
                {message, duplicateCount: 0, sameMessages: [], samePrefixCount: 0, sameSuffixCount: 0, size: message.length});
            this.frequencyMap.set(messageSuffix,
                {message, duplicateCount: 0, sameMessages: [], samePrefixCount: 0, sameSuffixCount: 0, size: message.length});
        }
    }

    public getLogMessagesFrequencyMap(): Map<string, LogMessageFrequency> {
        return this.frequencyMap;
    }

    private getMessagePrefix(message: string): string {
        return message.substring(0, this.prefixLength);
    }

    private getMessageSuffix(message: string): string {
        return message.substring(message.length -  this.suffixLength);
    }
}
