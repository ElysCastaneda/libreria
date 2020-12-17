const app = require('./server');

app.listen(app.get('port'), () => {
    console.log('Servidor en Puerto: ', app.get('port'));
});