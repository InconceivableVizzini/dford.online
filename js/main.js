'use strict';

import { riot, router, Router} from './commonrouter.js';
import './views/primary-navigation.js';
import './views/experiments.js';
import './views/pinhole.js';
import './views/visualizer.js';
import './views/info.js';
import './views/not-found.js';

var Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    NotFoundRoute = Router.NotFoundRoute,
    RedirectRoute = Router.RedirectRoute;

router.routes([
  new DefaultRoute({tag:'experiments'}),
  new Route({path:'/experiments', tag: 'experiments'}),
  new Route({path:'/visualizer', tag:'visualizer'}),
  new Route({path:'/composition', tag:'composition'}),
  new Route({path:'/pinhole', tag:'pinhole'}),
  new Route({path:'/ecosystems-farms', tag:'ecosystem-farms'}),
  new Route({path:'/info', tag: 'info'}),
  new NotFoundRoute({tag:'not-found'})
]);

riot.mount('*');
router.start();
