type RetryOptions = {
    kafkaClient: any;
    payload: any;
    error: Error;
    retryTopic: string;
    dlqTopic: string;
    maxRetry?: number;
}

const MAX_RETRY = Number(process.env.KAFKA_MAX_RETRY ?? 5);

export async function handleKafkaRetry({
  kafkaClient,
  payload,
  error,
  retryTopic,
  dlqTopic,
}: RetryOptions) {
  const retryCount = payload.retryCount ?? 0;

  if (retryCount < MAX_RETRY) {
    await kafkaClient.emit(retryTopic, {
      ...payload,
      retryCount: retryCount + 1,
      lastError: error.message,
      failedAt: new Date().toISOString(),
    });
  } else {
    await kafkaClient.emit(dlqTopic, {
      ...payload,
      retryCount,
      reason: error.message,
      failedAt: new Date().toISOString(),
    });
  }
}