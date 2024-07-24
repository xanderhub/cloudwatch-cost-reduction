export type LogMessageFrequency = {
    message: string;
    sameMessages: string[],
    samePrefixCount: number;
    sameSuffixCount: number;
    duplicateCount: number;
    size: number;
} | undefined;
