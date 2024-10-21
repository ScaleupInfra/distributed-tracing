const { Kafka } = require('kafkajs');
const express = require('express');
const app = express();
const { context, trace, propagation } = require('@opentelemetry/api');
require('./tracer'); // Import tracer to activate trace exporting

const kafka = new Kafka({
  clientId: 'consumer-client',
  brokers: [process.env.KAFKA_HOST || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'consumer-group' });

async function connectConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
  console.log('Consumer connected and subscribed to topic');
}

async function runConsumer() {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = message.value.toString();
      const headers = message.headers; // Get the trace context headers

      // Extract the context from the headers
      const extractedContext = propagation.extract(context.active(), headers); // Extract context from headers
      const tracer = trace.getTracer('default');
      
      // Create the span within the extracted context by setting the active context
      context.with(extractedContext, () => {
        const span = tracer.startSpan('process-message'); // Start new span within active context
        console.log('Message received:', payload);
        
        // Simulate message processing here

        span.end(); // End the span after processing
      });
    },
  });
}

app.listen(3001, async () => {
  await connectConsumer();
  await runConsumer();
  console.log('Consumer service listening on port 3001');
});
