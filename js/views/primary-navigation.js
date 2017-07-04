import { riot, router, Router} from '../commonrouter.js';

riot.tag('primary-navigation',
  `
  <div class="nav-left">
    <a class="nav-item" onclick={home}>derek ford</a>
  </div>
  <div class="nav-right is-active">
    <a class="nav-item" onclick={experiments}>experiments</a>
    <a class="nav-item" onclick={info}>info</a>
  </div>
  `,

  function (opts){
    this.home = (e) => {
      router.navigateTo('/');
    };
    this.experiments = (e) => {
      router.navigateTo('/experiments');
    };
    this.info = (e) => {
      router.navigateTo('/info');
    };
  }
);
	 
