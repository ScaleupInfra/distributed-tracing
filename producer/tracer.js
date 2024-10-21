// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
// const { Resource } = require('@opentelemetry/resources');
// const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
// const { registerInstrumentations } = require('@opentelemetry/instrumentation');
// const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
// const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
// const { KafkaJsInstrumentation } = require('@opentelemetry/instrumentation-kafkajs');
// const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
// const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// // Initialize the OpenTelemetry tracer
// const provider = new NodeTracerProvider({
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: 'producer-service', // Change as needed for producer or consumer
//   }),
// });

// // Use ConsoleSpanExporter to log spans to the console
// const exporter_1 = new ConsoleSpanExporter();

// // Add a SimpleSpanProcessor to output spans immediately
// provider.addSpanProcessor(new SimpleSpanProcessor(exporter_1));

// // Exporter to send traces to Jaeger via OTLP
// const exporter = new OTLPTraceExporter({
//   url: 'http://jaeger:4318/v1/traces', // Use Jaeger's OTLP endpoint
// });

// // Batch processor to send spans in batches
// // provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// // Register the provider globally
// provider.register();

// // Enable auto-instrumentation for HTTP, Express, KafkaJS
// registerInstrumentations({
//   instrumentations: [
//     new HttpInstrumentation(),
//     new ExpressInstrumentation(),
//     new KafkaJsInstrumentation(), // Automatically instrument KafkaJS
//   ],
// });

// // Get the tracer
// const tracer = provider.getTracer('kafka-service-tracer');

// // Export the tracer for use in your other files
// module.exports = tracer;



const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { KafkaJsInstrumentation } = require('@opentelemetry/instrumentation-kafkajs');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const dotenv = require("dotenv");
dotenv.config();

const sdk = new opentelemetry.NodeSDK({
  // traceExporter: new ConsoleSpanExporter(),
  traceExporter: new OTLPTraceExporter({ url: "http://jaeger:4318/v1/traces" }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new KafkaJsInstrumentation(), // Add KafkaJS instrumentation
  ],
});

sdk.start();
