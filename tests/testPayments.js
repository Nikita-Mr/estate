const { initPayment, awaitPayment } = require('../modules/payments');
const cmd = require('node-cmd');

const runTest = async () => {
    let { paymentRef, payment } = await initPayment('100', 'test');
    cmd.runSync(`start "" "${paymentRef}"`);
    await awaitPayment(payment);
}

runTest()