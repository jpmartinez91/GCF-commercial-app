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

const datastore = DataStore({})

exports.create = (req, res) =>
{
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
    res.set('Content-Type', 'application/json');
    const timestamp = new Date().getTime();

    const id = uuid.v1();
    const taskKey = datastore.key(['Product', id]);
    const info = {
        id_product: id,
        name_product: req.body.name_product,
        units_product: req.body.units_product,
        line_product: req.body.line_product,
        state_product: req.body.state_product,
        price_product: req.body.price_product,
        description_product: req.body.description_product,
        created: timestamp,
        updated: timestamp,
    }

    const dataS = {
        key: taskKey,
        data: info
    }

    datastore.save(dataS)
        .then(
            data =>
                res.status(200).send(
                    {
                        msg: "Item saved successfully",
                        data: data
                    }
                ))
        .catch((err) =>
        {
            console.error(err);
            sendRespose(res, 500, {
                msg: "Couldn't save item ",
                err: err.message
            })
        });
};

exports.list = (req, res) =>
{
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
    res.set('Content-Type', 'application/json');
    const query = datastore.createQuery('Product')
    datastore.runQuery(query)
        .then(
            results =>
            {
                console.log(results[0]);
                res.status(200).send(results[0])
            })
        .catch(
            (err) =>
            {
                console.error(err);
                sendRespose(res, 500, {
                    msg: "couldn't get items",
                    err: err.message
                })
            })
};

exports.update = (req, res) =>
{
    res.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
    res.set('Content-Type', 'application/json');
    const timestamp = new Date().getTime();
    const transaction = datastore.transaction();
    const taskKey = datastore.key(['Product', req.body.id_product]);
    transaction.run()
        .then(
            () => transaction.get(taskKey)
        )
        .then(
            results =>
            {
                const product = results[0]
                product.name_product = req.body.name_product;
                product.units_product = req.body.units_product;
                product.line_product = req.body.line_product;
                product.state_product = req.body.state_product;
                product.price_product = req.body.price_product;
                product.description_product = req.body.description_product;
                product.updated = timestamp;
                transaction.save({
                    key: taskKey,
                    data: product
                })
                transaction.commit();
            }
        )
        .then(
            res.status(200).send(
                {
                    saludo: "hola a todos",
                    kk: "porque estamos aqui"
                }
            )
        )
        .catch(
            err =>
            {
                console.log(err);
                sendRespose(res, 500, {
                    msg: "Update didn't be performed",
                    err: err.message
                })
            }
        )
};

exports.delete = (req, res) =>
{
    res.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
    res.set('Content-Type', 'application/json');
    const taskKey = datastore.key(['Product', req.query.id]);
    datastore.delete(taskKey)
        .then(
            () =>
            {
                sendRespose(res, 500, {
                    msg: "Deleted successfully",
                })
            }
        )
        .catch(
            err =>
            {
                console.error(err);
                sendRespose(res, 500, {
                    msg: "Delete didn't be performed",
                    err: err.message
                })
            }
        )
};

function sendRespose(res, code, msg)
{
    res.status(code).send(msg)
}