const amqp = require('amqplib');
const { exchangerName } = require('./rabbitmq_conf');
require('dotenv').config();


class Producer {
    channel;

    async setChannel() {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = (await connection.createChannel())
        
    }


    async produceMessage(routingKey, message) {
        if (this.channel == null) {
            await this.setChannel();
        }

        await this.channel.assertExchange(exchangerName, "direct");

        const final_message = {
            logType: routingKey,
            msg: message,
            date: new Date()
        }
        console.log(routingKey);
        this.channel.publish(exchangerName, routingKey, Buffer.from(JSON.stringify(final_message)));
    }
}

module.exports = Producer;