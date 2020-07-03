const express = require("express");
const bodyParser = require("body-parser");
const engines = require("consolidate");
const paypal = require("paypal-rest-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

paypal.configure({
    mode: "live", //sandbox or live
    // client_id: "ARDBERlL05oWPd9JXRyrcB8KX3vDZo8Rs-YoHtvWT66iBBfEB7zqUjiwGYFBmJt1jDE3TsgVlbqGo_4h",
    // client_secret:"EOFTm9yq-GlgHRTV6YbRMqPGsYVu6v2dAo1h2KmcVbY43_A76oowDZLqxTol-LkO6KAjV0Z-V8jwlbWU"
    client_id:'AQ6y7ESlLmfbfhrypDQgxmLA5Cbh5goDMp1LfpB-7w_Jo1r_N1GHrIGWFmNktWW_bPB_NPe60ghYE_IV',
    client_secret: 'EFcCsXDNgg_ljnundPwLB1aaaj5SK1fUFbV_O3VaebiVBrU7Jz4Z9ZJuYZs3a9UJv8HDtRi6VKAnH4vE'
});

// app.get("/", (req, res) => {
//     res.render("index");
// });

app.get("/", (req, res) => {
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: "https://better-u-c3095.web.app/success",
            cancel_url: "https://better-u-c3095.web.app/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "Donation",
                            sku: "Donations",
                            price: "5.00",
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: "5.00"
                },
                description: "Donate atleast 5 usd."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });
});

app.get("/success", (req, res) => {
    // res.send("Success");
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: "5.00"
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("success");
        }
    });
});

app.get("cancel", (req, res) => {
    res.render("cancel");
});

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
