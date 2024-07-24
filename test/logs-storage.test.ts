import { LogsStorage } from '../logs-storage';

describe('LogsStorage test', () => {
    let logsStorage: LogsStorage;

    beforeEach(() => {
        logsStorage = new LogsStorage();
    });

    it('should store log message correctly', () => {
        logsStorage.storeLogMessage('Test log message with same prefix and different suffix jbfye76878hdjbfuyt characters');
        logsStorage.storeLogMessage('Test log message with same prefix and different suffix 854185418481531848 letters');
        logsStorage.storeLogMessage('Duplicate log message with payload of 100 characters');
        logsStorage.storeLogMessage('Duplicate log message with payload of 100 characters');
        logsStorage.storeLogMessage('Duplicate log message with payload of 100 characters');
        logsStorage.storeLogMessage('log ytrxbv message 66r7r678hfjbnuh with different prefix but same suffix');
        logsStorage.storeLogMessage('Lab32748476 log 8565678jbhhhhtttt with payload with different prefix but same suffix');
        logsStorage.storeLogMessage('Log log log log log log log log message with different prefix but same suffix');

        const frequencyMap = logsStorage.getLogMessagesFrequencyMap();

        expect(frequencyMap.size).toBe(6);
    });
});
