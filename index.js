const express = require("express");
const path = require("path");
const { generateQR, addPoints, decodeQR } = require("./qr");
const { serverURL, admin_password, battleship_password, suwi_password, tiup_bola_password, musical_chair_password, uno_flip_password, uno_jenga_password, picpacpong_password, piramid_password, angkat_pingpong_password, kartu_memori_password } = require("./env.json");
const fs = require("fs")

const cors = require('cors');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "100mb" }));
app.use(express.static("public"))
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/", (req, res) => {
    return res.send(`<html><head><style>body { font-family: Arial, sans-serif; }</style></head><body><nav class="navigation"><ul><li><a href="./points">Points</a></li><li><a href="./get-example-qr">QR</a><li><a href="./adminpanel.html">adminpanel</a></li></li></ul></nav></body></html>`)
})

app.get("/get-example-qr", async (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('data.json'));
        const { Apollo, Vanguard, Titan, Falcon } = data;
        const qrPromises = [
            ...Apollo.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) })),
            ...Vanguard.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) })),
            ...Titan.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) })),
            ...Falcon.map(team => ({ name: team.name, points: team.points, qr: generateQR(team.name) }))
        ];

        const allTeams = await Promise.all(qrPromises);
        let final = `<html><head><style>body { font-family: Arial, sans-serif; }</style></head><body><nav class="navigation"><ul><li><a href="./points">Points</a></li><li><a href="./get-example-qr">QR</a><li><a href="./adminpanel.html">adminpanel</a></li></li></ul></nav>`;
        for (const team of allTeams) {
            const { name, points, qr } = team;
            final += `<div style="margin-bottom: 40px;">
                <h2>${name}</h2>
                <p>Points: ${points}</p>
                <img src='${await qr}' style="max-width: 300px; height: auto;" />
            </div>`;
        }
        final += "</body></html>";
        res.send(`${final}  ${JSON.stringify(data)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/points", async (req, res) => {
    let final = `<html><head><style>body { font-family: Arial, sans-serif; }</style></head><body><nav class="navigation"><ul><li><a href="./points">Points</a></li><li><a href="./get-example-qr">QR</a><li><a href="./adminpanel.html">adminpanel</a></li></li></ul></nav><table border='1'><thead><tr><th>id</th><th>kelompok</th><th>tim</th><th>history</th><th>Points</th></tr></thead><tbody><tr>`;
    const data = JSON.parse(fs.readFileSync('data.json'));
    const { Apollo, Vanguard, Titan, Falcon } = data;
    const allTeams = [
        ...Apollo.map(team => ({ name: team.name, points: team.points, history: team.history, bigTeam: "Apollo" })),
        ...Vanguard.map(team => ({ name: team.name, points: team.points, history: team.history, bigTeam: "Vanguard" })),
        ...Titan.map(team => ({ name: team.name, points: team.points, history: team.history, bigTeam: "Titan" })),
        ...Falcon.map(team => ({ name: team.name, points: team.points, history: team.history, bigTeam: "Falcon" }))
    ];
    let ctr = 1;
    for (const team of allTeams) {
        const { name, points, bigTeam, history } = team;
        let hist = ""
        for (let i = 0; i < history.length; i++) {
            hist += `${history[i]}<br>`
        }
        final += `<tr>
            <td>${name}</td>
            <td>${bigTeam}</td>
            <td>${ctr++}</td>
            <td>${hist}</td>
            <td>${points}</td>
          </tr>`;
        if (ctr > 3) {
            ctr = 1;
        }
    }
    final += "</tbody></table></body></html>";
    res.send(final)
})

app.get("/adminpanel.html", async (req, res) => {
    res.sendFile(path.join(__dirname, 'adminpanel.html'));
});

app.get("/battleship", async (req, res) => {
    res.sendFile(path.join(__dirname, 'battleship.html'));
});

app.post("/battleshipdata", async (req, res) => {
    console.log(req.body);
    const { qrCode, cell } = req.body;
    // Process the battleship data
});

app.get("/battleshipadmin", async (req, res) => {
    res.sendFile(path.join(__dirname, 'battleshipadmin.html'));
});

app.get("/battleshipadmindata", async (req, res) => {
    res.send({ d: "masuk gan" });
});

app.get("/instascan.min.js", async (req, res) => {
    res.sendFile(path.join(__dirname, 'instascan.min.js'));
});

app.get("/html5-qrcode.min.v2.3.0.js", async (req, res) => {
    res.sendFile(path.join(__dirname, 'html5-qrcode.min.v2.3.0.js'));
});

app.get("/data.json", async (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'));
});

app.post("/adminpanel", async (req, res) => {
    try {
        const { qrCode, winner, password } = req.body;
        console.log(req.body);
        let namaPos = "";
        if (password === battleship_password) {
            namaPos = "battleship";
        } else if (password === suwi_password) {
            namaPos = "suwi";
        } else if (password === tiup_bola_password) {
            namaPos = "tiup_bola";
        } else if (password === musical_chair_password) {
            namaPos = "musical_chair";
        } else if (password === uno_flip_password) {
            namaPos = "uno_flip";
        } else if (password === uno_jenga_password) {
            namaPos = "uno_jenga";
        } else if (password === picpacpong_password) {
            namaPos = "picpacpong";
        } else if (password === piramid_password) {
            namaPos = "piramid";
        } else if (password === angkat_pingpong_password) {
            namaPos = "angkat_pingpong";
        } else if (password === kartu_memori_password) {
            namaPos = "kartu_memori";
        } else if (password !== admin_password && namaPos === "") {
            return res.status(400).send("Incorrect password");
        }
        let pointsAdd = 0;
        if (winner == 'win') {
            pointsAdd = 100;
        } else if (winner == 'draw') {
            pointsAdd = 60;
        } else if (winner == 'lose') {
            pointsAdd = 40;
        }
        addPoints(qrCode, pointsAdd, namaPos);

        return res.send(`Points have been updated ${qrCode}, ${pointsAdd}, ${namaPos}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred");
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
