const { Kafka } = require('kafkajs');
const express = require('express');
const app = express();
const { trace, context, propagation } = require('@opentelemetry/api');
require('./tracer'); // Import tracer to activate auto-instrumentation

const kafka = new Kafka({
  clientId: 'producer-client',
  brokers: [process.env.KAFKA_HOST || 'localhost:9092'],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log('Producer connected to Kafka');
}

app.use(express.json());

app.post('/produce', async (req, res) => {
  const { message } = req.body;

  try {
    const tracer = trace.getTracer('default');
    const span = tracer.startSpan('kafka-produce'); // Manually start a span for producing
    const activeContext = trace.setSpan(context.active(), span);
    
    const headers = {};
    propagation.inject(activeContext, headers); // Inject trace headers

    await producer.send({
      topic: 'my-topic',
      messages: [
        {
          value: JSON.stringify({ data: message }),
          headers: headers,
        },
      ],
    });

    span.end(); // End span after the message is sent
    console.log('Message sent:', message);
    res.send('Message sent');
  } catch (error) {
    console.error('Error producing message', error);
    res.status(500).send('Error producing message');
  }
});

app.listen(3000, async () => {
  await connectProducer();
  console.log('Producer service listening on port 3000');
});


