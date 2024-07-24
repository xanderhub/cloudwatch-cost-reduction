import { analyze } from '../logs-analyzer';
import {LogsAnalyzerResult} from "../logs-analyzer-result";

describe('LogsAnalyzer test', () => {
    it('should analyze log message correctly', async () => {
        const logMessage = 'Test log message with same prefix and different suffix jbfye76878hdjbfuyt characters';
        const result: LogsAnalyzerResult =
            await analyze("/aws/lambda/test-lambda-hybrid-recording-screen", "2024/07/23/[$LATEST]c55e21ab8c3c4378805ba11874e2abd5");

        expect(result).toBeTruthy();
        expect(result.report.redundantLogs.count).toBe(5);
        expect(result.report.redundantLogPayloads.count).toBe(3);
        expect(result.report.duplicatedLogs.length).toBe(0);
    });
});
