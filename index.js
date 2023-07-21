const express = require("express");
const path = require("path");
const { generateQR, addPoints, decodeQR } = require("./qr");
const { serverURL, admin_password } = require("./env.json");
const { Apollo, Vanguard, Titan, Falcon } = require("./data");
const cors = require('cors');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "100mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

let cell = null;

app.get("/get-example-qr", async (req, res) => {
    try {
        const qr = await addPoints();
        const allTeams = [
            ...Apollo.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) })),
            ...Vanguard.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) })),
            ...Titan.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) })),
            ...Falcon.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) }))
        ];

        let final = "<html><head><style>body { font-family: Arial, sans-serif; }</style></head><body>";
        for (const team of allTeams) {
            const { name, points, qr } = await team;
            final += `<div style="margin-bottom: 40px;">
                <h2>${name}</h2>
                <p>Points: ${points}</p>
                <img src='${await qr}' style="max-width: 300px; height: auto;" />
            </div>`;
        }
        final += "</body></html>";

        res.send(final);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/adminpanel", async (req, res) => {
    res.sendFile(__dirname + '/adminpanel.html');
})

app.get("/battleship", async (req, res) => {
    res.sendFile(__dirname + '/battleship.html');
})

app.post("/battleshipdata", async (req, res) => {
    console.log(req.body)
    const { qrCode, cell } = req.body;
    // if()
})

app.get("/battleshipadmin", async (req, res) => {
    res.sendFile(__dirname + '/battleshipadmin.html');
})

app.get("/battleshipadmindata", async (req, res) => {
    res.send({ d: "masuk gan" })
})
app.get("/instascan.min.js", async (req, res) => {
    res.sendFile(__dirname + '/instascan.min.js');
})
app.get("/html5-qrcode.min.v2.3.0.js", async (req, res) => {
    res.sendFile(__dirname + '/html5-qrcode.min.v2.3.0.js');
})
app.get("/data.json", async (req, res) => {
    res.sendFile(__dirname + '/data.json');
})

app.post("/adminpanel", async (req, res) => {
    // console.log(req.body);
    const { qrCode, winner, password } = req.body;
    console.log(req.body);
    if (password != admin_password) {
        return res.status(400).send("salah password");
    }
    addPoints(qrCode, 10);
    // let dec = await decodeQR(qrCode);
    // console.log(dec)
    res.send();
    // res.sendFile(__dirname + '/adminpanel.html');
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
