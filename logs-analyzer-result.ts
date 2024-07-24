export type LogsAnalyzerResult = {
    serviceName: string;
    report: {
        duplicatedLogs: DuplicatedLog[],
        redundantLogs: RedundantLogs,
        redundantLogPayloads: RedundantLogPayloads
    }
}

export type DuplicatedLog = {
    value: string;
    count: number;
}

export type RedundantLogs = {
    logs: string[];
    count: number;
}

export type RedundantLogPayloads = {
    logs: string[];
    count: number;
}
