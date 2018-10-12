const DataStore = require("@google-cloud/datastore");
const uuid = require("uuid");

const projectID = "patotesis";
/**
 * HTTP Cloud Function.
 * * @param {Object} req Cloud Function request context.
 * More info: https://expressjs.com/en/api.html#req
 * * @param {Object} res Cloud Function response context.
 * More info: https://expressjs.com/en/api.html#res 
 **/

const datastore = DataStore({

})

exports.create = (req, res) =>
{
    console.log("***********************************");

    res.set('Access-Control-Allow-Origin', '*');
    switch (req.method) {
        case 'GET':
            // hanldeGET(req, res);
            break;
        case 'POST':
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
            res.set('Content-Type', 'application/json');
            if (!req.body) {
                throw new Error("Request body error, make sure you have values in your request");
            }
            handlePOST(req, res);
            break;
        case "PUT":
            // hanldePUT(req, res);
            break;
        case 'OPTIONS':
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
            res.set('Content-Type', 'application/json');
            res.send({ saludo: "hola a todos", kk: "asdasd" });
        default:
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
            res.set('Content-Type', 'application/json');
            res.status(500).send({ error: 'Something blew up!' });
            break;
    }
};

function handlePOST(req, res)
{
    const timestamp = new Date().getTime();
    const taskKey = datastore.key('Task');
    const info = {
        id_product: uuid.v1(),
        name: req.body.name_product,
        units: req.body.units_product,
        line: req.body.line_product,
        state: req.body.state_product,
        price: req.body.price_product,
        description: req.body.description_product,
        created: timestamp,
        updated: timestamp,
    }

    const dataS = {
        key: taskKey,
        data: info
    }

    datastore.save(dataS).then(() => res.status(200).send({ saludo: "hola a todos", kk: "asdasd" })).catch((err) =>
    {
        console.log("--------------------");
        console.error(err);
        res.status(500).send(err.message);
    });
}
