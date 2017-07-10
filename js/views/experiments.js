import { riot, router, Router} from '../commonrouter.js';

riot.tag('experiments',
  `
  <div class="tile is-vertical">
    <div class="tile">
      <div class="tile is-parent is-8 is-left-triplet">
         <article class="tile is-child experiment-hero matte-painting-rv-hero">
	 <div class="background"></div>
	 <div class="content" onclick={composition}>
	 <p>Composition-focused matte paintings.</p>
	 </div>
	 </article>
      </div>
      <div class="tile is-parent is-vertical is-right-triplet">
        <article class="tile is-child experiment-hero visualizer-hero">
          <div class="background"></div>
          <div class="content" onclick={visualizer}>
            <p>Audio visualization.</p>
          </div>
        </article>
        <article class="tile is-child experiment-hero pinhole-hero">
          <div class="background"></div>
          <div class="content" onclick={pinhole}>
            <p>Pinhole, an adventure for Eclipse Phase.</p>
          </div>
        </article>
      </div>
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
	 
