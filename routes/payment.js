require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const Donation = require("../models/Donation");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
    const { name, phone, email, amount, message } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: { name: "Donation" },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://funding-front-end-three.vercel.app/payment/success",
            cancel_url: "https://funding-front-end-three.vercel.app/payment/cancel",
            metadata: {
                name,
                phone,
                email,
                message,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: error.message });
    }
});


router.get("/payments",verifyToken ,async (req, res) => {
    try {
        console.log("Admin ",req.admin);
        const sessions = await stripe.checkout.sessions.list();
        const data = sessions.data.map((session) => {
            return {
                id: session.id,
                amount: session.amount_total/100,
                email: session.customer_email,
                status: session.payment_status,
                message: session.metadata.message,
                name: session.metadata.name,
                phone: session.metadata.phone,
                date: new Date(session.created * 1000).toLocaleString(),
            };
        });

        const donations = sessions.data.filter((session) => session.payment_status === "paid")
        const totalDonations = donations.reduce((acc, donation) => acc + donation.amount_total/100, 0);
        const totalCount = donations.length;
        const dashboardData = {
            "total" : totalDonations,
            "donors" : totalCount
        }
        res.json({ data, dashboardData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/dashboard",verifyToken, async (req, res) => {
    try {
        console.log("Admin ",req.admin);
        const donations = await stripe.checkout.sessions.list();
        const totalDonations = donations.reduce((acc, donation) => acc + (donation.amount/100), 0);
       
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;