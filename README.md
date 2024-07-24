# cloudwatch-cost-reduction
Sparkathon project to reduce AWS costs

    Usage:

logs-analyzer.ts module has the following API: **analyze(logGroupName: string, logStreamName: string)** &nbsp;
Run test **logs-analyzer.test.ts** to see an example of the flow.
Ensure you're running the AWS credentials script before running the test.

    Tested on: 

**logGroupName: "/aws/lambda/test-lambda-hybrid-recording-screen"**

**logStreamName: "2024/07/23/[$LATEST]c55e21ab8c3c4378805ba11874e2abd5"**

Link: https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups/log-group/$252Faws$252Flambda$252Ftest-lambda-hybrid-recording-screen/log-events/2024$252F07$252F23$252F$255B$2524LATEST$255Dc55e21ab8c3c4378805ba11874e2abd5

    The result of the analyze function is the following JSON file:
```{
  "duplicatedLogs": [],
  "redundantLogs": {
    "logs": [
      "\tINFO\tINFO RedisManager [__] connecting to Redis with port:6379 and host: redissearch.recording.test.wfosaas.internal.com\n",
      "\tINFO\tINFO RedisManager [__] Got \"connect\" event from Redis. Stream is connected to the server\n",
      "\tINFO\tINFO RedisManager [__] Got \"ready\" event from Redis. Connection established.\n",
      "\tINFO\tINFO RedisManager [__] Redis connection established.\n",
      "\tINFO\tINFO RedisManager [__] Received tenant data from Redis: {\"billingId\":\"459484\"}\n"
    ],
    "count": 5
  },
  "redundantLogPayloads": {
    "logs": [
      "\tINFO\tINFO appHandler [__] Received event: {\"startTime\":\"2024-07-20T20:03:23.687Z\",\"endTime\":\"2024-07-20T20:09:01.153Z\",....",
      "\tINFO\tINFO S3Handler [__] Filter only successful screen recordings:  {\"startTime\":\"2024-07-20T20:03:23.687Z\",\"endTime\":\"2024-07-20T20:09:01.153Z\",\"wrapUpTime\"....",
      "\tERROR\tInvoke Error \t{\"errorType\":\"RetryableError\",\"errorMessage\":\"MissingEncryptionGuidInDdbException: Encryption Guid:[27C83895-7EB8-4056-9F0A-A225B1DCA7C3] was not found\",\"    at validateEncryptionGuidExsits (/var/task/app/nmfHandler.js:63:15)\",\"    at setEncryptionObject (/var/task/app/nmfHandler.js:111:9)\",\"    at handleEncGuidSwitching (/var/task/app/nmfHandler.js:384:17)\",\"    at readParams (/var/task/app/nmfHandler.js:320:21)\",\"    at getChunk (/var/task/app/nmfHandler.js:276:29)\"]}\n"
    ],
    "count": 3
  }
}
}```


Where:
duplicatedLogs = all logs that have duplicated messages (where prefixes and suffixes of messages are equal)
redundentLogs = all logs that have same prefix or suffix (this part of report points to a potantialy redundent logs - consider to reduce the amount of logs by merging them into one or by ommiting a part of them) 
redundentLogPayloads = long messages (> 1000 characters, can be configurable in config.json) or those that have eror stack trace inside
