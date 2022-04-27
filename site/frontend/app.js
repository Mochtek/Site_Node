const express = require('express');
const app = express();
const linky = require('linky');
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public',express.static('/public'));


app.use('/accueil', function (req, res) {
    res.sendFile(__dirname + '/Accueil/accueil.html');
});

app.use('/map', function (req, res) {
    res.sendFile(__dirname + '/Map/map.html');
});

app.use('/energymix', function (req, res) {
    res.sendFile(__dirname + '/Energymix/energymix.html');
});


app.get('/json', function (req, res) {
    res.sendFile(__dirname + '/Energymix/out.json');
});

app.use('/linky', function (req, res) {
    res.sendFile(__dirname + '/Linky/linky.html');
});

app.get('/enedis',  (req,res) => {
    let AToken = req.query.AToken;
    let RToken = req.query.RToken;
    let UToken = req.query.UToken;
    let Debut = req.query.Debut;
    let Fin = req.query.Fin;

    //pour acceder a la page : 
    const session = new linky.Session({
        accessToken: AToken,
        refreshToken: RToken,
        usagePointId: UToken,
        onTokenRefresh: (accessToken, refreshToken) => {
            // Cette fonction sera appelée si les tokens sont renouvelés
            // Les tokens précédents ne seront plus valides
            // Il faudra utiliser ces nouveaux tokens à la prochaine création de session
            // Si accessToken et refreshToken sont vides, cela signifie que les tokens ne peuvent plus
            // être utilisés. Il faut alors en récupérer des nouveaux sur conso.vercel.app
        },
    });
    session.getDailyConsumption(Debut, Fin).then((conso) => {
    res.status(200).json(conso)
    });

});

app.use('/conso', function (req, res) {
    res.sendFile(__dirname + '/Linky/conso.html');
});

app.get('/stats', function (req, res) {
    res.sendFile(__dirname + '/Stats/stats.html');
});

app.get('/database', function (req, res) {
    res.sendFile(__dirname + '/csv/database.csv');
});

module.exports = app;