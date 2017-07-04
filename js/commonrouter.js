import riot from 'riot';
import route from 'riot-route';
import Router from 'riot-router';
var router = Router.create({route: route});

module.exports = {
    riot: riot,
    router: router,
    Router: Router
}
