console.log("Avvio del server...");
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const CLIENTIDSDO = '3MVG9VTfpJmxg1yghCvfNVovbFacM5jy5KNTntI06FXU12KHSNRq05IMFrzyl9_EXCTW5GdiEmF72bzfJpCx3';
const CLIENTSECRETSDO = 'AF63160C4D3C3734A6C4B17ACC794DC27F489F26E02F0A76BD8580BED10CF6F8';
const TOKENURLSDO = "https://ssg-agentforce.my.salesforce.com/services/oauth2/token";

const AGENT_ID = '0XxHu000000qujpKAA';
const DOMAIN = 'ssg-agentforce.my.salesforce.com';
const SESSION_ID=1;

app.post("/get-token", async (req, res) => {
  try {
    // 1. Ottieni access token
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENTIDSDO,
      client_secret: CLIENTSECRETSDO
    });

    const tokenResponse = await axios.post(TOKENURLSDO, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const accessToken = tokenResponse.data.access_token;

    // 2. Crea sessione Einstein
    const sessionResponse = await axios.post(
      `https://api.salesforce.com/einstein/ai-agent/v1/agents/${AGENT_ID}/sessions`,
      {
        externalSessionKey: uuidv4(),
        instanceConfig: {
          endpoint: `https://${DOMAIN}`
        },
        streamingCapabilities: {
          chunkTypes: ['Text']
        },
        bypassUser: true
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const sessionId = sessionResponse.data.sessionId;

    console.log('Agent Response: ',sessionResponse.data.messages);
    var mess = sessionResponse.data.messages[0].message;
    console.log('Agent message: ',mess);
    app.post("/get-agent-message", (req, res) => {
      const agentMessage = mess;//"Ciao! Come posso aiutarti oggi?";
      res.json({ agentMessage });
    });

    sequenceId = 1;
    const response = await axios.post(
        `https://api.salesforce.com/einstein/ai-agent/v1/sessions/${sessionId}/messages/stream`,
        {
          message: {
            sequenceId: sequenceId,
            type: "Text",
            text: "I'm Simone, how are you?"
          }
        },
        {
          headers: {
            "Accept": "text/event-stream",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );
  
      console.log('Message sent successfully:', response.data);

    res.json({
      token: tokenResponse.data,
      session: sessionResponse.data
    });

  } catch (error) {
    console.error('❌ Errore:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.post("/send-message", async (req, res) => {
  try {
    const { message } = req.body; // Ottieni il messaggio dal corpo della richiesta
    console.log("Messaggio ricevuto dal frontend:", message);

    // Simula una risposta del bot o invia il messaggio a Salesforce Einstein
    const reply = `Hai detto: "${message}". Come posso aiutarti?`;

    // Rispondi al frontend con il messaggio del bot
    res.json({ reply });
  } catch (error) {
    console.error("Errore durante l'elaborazione del messaggio:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
