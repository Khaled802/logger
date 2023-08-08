const empq = require('amqplib');
const { exchangerName } = require('./rabbitmq_conf')

const cunsomeInfoLog = async () => {
    const connection = await empq.connect('amqp://localhost:5672');
    const channel = (await connection.createChannel())

    await channel.assertExchange(exchangerName, 'direct');
    const { queue } = await channel.assertQueue('warningErrorQueue');

    await channel.bindQueue(queue, exchangerName, 'warning');
    await channel.bindQueue(queue, exchangerName, 'error');

    channel.consume(queue, (msg=>{
        const result = JSON.parse(msg.content);
        console.log(result);
        channel.ack(msg);
    }))
}

cunsomeInfoLog();