import { Kafka, Partitioners } from "kafkajs";
import fs from "fs";
import path from "path";
import Message from "../models/message.models.js";
import Conversation from "../models/conversation.models.js";

const __dirname = path.resolve(); // Get the current directory

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [
      fs.readFileSync(
        path.join(__dirname, "./backend/certificates/ca.pem"),
        "utf-8"
      ),
    ],
  },
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});
let kafkaProducer = null;

const createProducer = async () => {
  try {
    if (kafkaProducer !== null) return kafkaProducer;
    const newProducer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await newProducer.connect();
    kafkaProducer = newProducer;
    return kafkaProducer;
  } catch (err) {
    console.log("Error while creating kafka producer: ", err);
  }
};

export const produceMessage = async (senderId, receiverId, message) => {
  try {
    if (kafkaProducer === null) {
      kafkaProducer = await createProducer();
    }
    await kafkaProducer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [
        {
          key: `message-${Date.now()}`,
          value: JSON.stringify({ senderId, receiverId, newCtx: message }),
        },
      ],
    });

    return true; // Message sent successfully
  } catch (err) {
    console.log("Error while producing message: ", err);
  }
};

export const startConsumer = async () => {
  const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC });
  console.log("Kafka consumer started");
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      try {
        const { senderId, receiverId, newCtx } = JSON.parse(
          message.value.toString()
        );
        let conversation = await Conversation.findById({ _id: receiverId });
        const newMessage = new Message({
          senderId,
          receiverId,
          message: newCtx,
        });

        if (newMessage) {
          conversation.currCtx = newMessage._id;
        }

        await Promise.all([conversation.save(), newMessage.save()]); // This is a better way to save multiple documents in parallel
      } catch (err) {
        console.log("Error while processing message: ", err);
        // Pause the consumer and restart the consumer after 5 seconds
        pause();
        setTimeout(() => {
          consumer.resume(process.env.KAFKA_TOPIC);
        }, 5000);
      }
    },
  });
};

export default kafka;
