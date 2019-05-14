// var stripe = require("stripe")("sk_test_R2TxJIW1kYX2H3VcBzAqNSmS");

// (async () => {
//   const charge = await stripe.charges.create({
//     amount: 999,
//     currency: 'usd',
//     source: 'tok_visa',
//     receipt_email: 'angela@mavennet.com',
//   });

//   console.log(charge);
// })();

const configureStripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.NODE_ENV === 'production'
    ? 'sk_live_MY_SECRET_KEY'
    : 'sk_test_MY_SECRET_KEY';

const stripe = configureStripe(STRIPE_SECRET_KEY);

module.exports = stripe;