const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendMail } = require("./../utils");

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event = req.body;

    console.log("Received webhook event:", req.body);

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const name = session.metadata.name;
        const phone = session.metadata.phone;
        const email = session.metadata.email;
        const amount = session.amount_total / 100;
        const message = session.metadata.message;

        await sendMail(
            'DonateHope <purificationevan04@gmail.com>', // from
            `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #4CAF50;">Thank You for Your Donation!</h2>
                <p style="font-size: 16px; color: #333;">
                    Dear <strong>${name}</strong>,
                </p>
                <p style="font-size: 16px; color: #333;">
                    We sincerely appreciate your generous donation of <strong>BDT ${amount}</strong>.
                </p>
                <p style="font-size: 16px; color: #333;">
                    <strong>Your Message:</strong> ${message || 'No message provided.'}
                </p>
                <p style="font-size: 16px; color: #333;">
                    <strong>Phone Number:</strong> ${phone}
                </p>
                <br/>
                <p style="font-size: 14px; color: #777;">
                    Your support helps us continue our mission. Thank you again!
                </p>
            </div>
            `,
            'Thank you for your donation!',
            email
        );

    } else if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!");
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;
