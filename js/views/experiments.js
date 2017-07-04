import { riot, router, Router} from '../commonrouter.js';

riot.tag('experiments',
  `
  <div class="tile is-12 experiment-hero pinhole-hero">
    <div class="background"></div>
    <div class="content" onclick={pinhole}>
      <p>Pinhole, an adventure for Eclipse Phase.</p>
    </div>
  </div>
  <div class="tile is-8 experiment-hero visualizer-hero">
    <div class="background"></div>
    <div class="content" onclick={visualizer}>
      <p>Audio visualization.</p>
    </div>
  </div>
  `,

  function (opts) {
    this.pinhole = (e) => {
      router.navigateTo('/pinhole');
    }
    this.visualizer = (e) => {
      router.navigateTo('/visualizer');
    }
    this.composition = (e) => {
      router.navigateTo('/composition');
    }
    this.efarms = (e) => {
      router.navigateTo('/ecosystems-farms');
    }
  }
);
	 
