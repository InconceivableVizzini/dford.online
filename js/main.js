'use strict';

import { riot, router, Router} from './commonrouter.js';
import './views/primary-navigation.js';
import './views/experiments.js';
import './views/pinhole.js';
import './views/composition.js';
import './views/visualizer.js';
import './views/prim.js';
import './views/lathe.js';
import './views/emulation-environment.js';
import './views/info.js';
import './views/not-found.js';

// Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

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
  new Route({path:'/prim', tag:'prim'}),
  new Route({path:'/lathe', tag:'lathe'}),
  new Route({path:'/ee', tag:'ee'}),
  new Route({path:'/info', tag: 'info'}),
  new NotFoundRoute({tag:'not-found'})
]);

router.on('route:updated', () => {

  let uri = (router.current.uri=='/')?'/experiments':router.current.uri;

  //window.ga_debug = {trace: true};
  ga('create', 'UA-102312297-1', 'auto');
  //ga('set', 'sendHitTask', null);
  ga('set', 'page', uri);
  ga('send', 'pageview');
});

riot.mount('*');
router.start();
