const express = require("express");
// const fetch = require("node-fetch"); // Rimuovi questo se usi Node.js 18+

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server in esecuzione");
});

app.post("/proxy/salesforce-token", async (req, res) => {
    
    /* Personal org 
    const url = "https://dev-lab2-dev-ed.my.salesforce.com/services/oauth2/token";
    const clientId = "3MVG96_7YM2sI9wRJrViMqAsai_eNpAQ3PZ4S6XQ6EQwSQXUvD8bq4Dn6.Oul4fwm0L4Uu_zkck8NDLN6HhLH";
    const clientSecret ="0BC22CDF18C1104656898ABF3DDF3FC7FF38758081B3C3B775027BEE817702C9";
    */
    
    /* AgentForce Org*/
    const url = "https://ssg-agentforce.my.salesforce.com/services/oauth2/token";
    const clientId = "3MVG9VTfpJmxg1yghCvfNVovbFacM5jy5KNTntI06FXU12KHSNRq05IMFrzyl9_EXCTW5GdiEmF72bzfJpCx3";
    const clientSecret = "AF63160C4D3C3734A6C4B17ACC794DC27F489F26E02F0A76BD8580BED10CF6F8";
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Errore nel proxy:", error);
        res.status(500).send("Errore nel proxy");
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server in esecuzione su http://localhost:${PORT}`);
});