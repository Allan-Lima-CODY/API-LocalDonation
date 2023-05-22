import express from "express";
import localDonationRoutes from "./routes/localDonation.js"
import addressDonationRoutes from "./routes/addressDonation.js"

const app = express();

app.use(express.json());
app.use(localDonationRoutes);
app.use(addressDonationRoutes);

const port = 3000;
app.listen(port, () => {
    console.log("Server activate on port ", port);
});