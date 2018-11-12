import { riot, router, Router } from '../commonrouter.js';

riot.tag('experiments',
  `
  <div class="tile is-vertical">
    <div class="tile">
      <div class="tile is-parent is-8 no-space-left">
      <article class="tile is-child experiment-hero ee-hero">
        <img src="/assets/img/ee-alpha.png" alt="Prim" />
        <div class="content" onclick={ee}>
          <p>A reverse engineering tool.</p>
        </div>
      </article>
      </div>
      <div class="tile is-parent is-vertical no-space-right">
        <article class="tile is-child experiment-hero visualizer-hero">
          <img src="/assets/img/strapyourselfin.png" alt="Audio Visualization" />
          <div class="content" onclick={visualizer}>
            <p>Audio visualization.</p>
          </div>
        </article>
        <article class="tile is-child experiment-hero pinhole-hero">
          <img src="/assets/img/starfield-hero.png" alt="Pinhole" />
          <div class="content" onclick={pinhole}>
            <p>Pinhole, an adventure for Eclipse Phase.</p>
          </div>
        </article>
      </div>
    </div>
  </div>
  <div class="tile is-vertical">
    <div class="tile">
      <div class="tile is-parent no-space-left">
        <article class="tile is-child experiment-hero prim-hero">
          <img src="/assets/img/prim_ast.png" alt="Prim" />
          <div class="content" onclick={prim}>
            <p>A math-focused programming language.</p>
          </div>
        </article>
      </div>
      <div class="tile is-parent no-space-right">
        <article class="tile is-child experiment-hero lathe-hero">
          <img src="/assets/img/gingerylathe1.png" alt="Lathe" />
          <div class="content" onclick={lathe}>
            <p>A metal lathe.</p>
          </div>
        </article>
      </div>
    </div>
  </div>
  `,

  function (opts) {
    let start_time = -1.0;

    const fadeValue = (fade_type, x) => {
      return ((fade_type) ? x/1000 :
	      (1/  Math.max(0.0, Math.min(1.0, (x/1000)))  ));
    }

    const fadePageInAsync = () => {
      const main_el = document.querySelector('body > main');

      if (start_time<0) {
	start_time = (new Date()).getTime();	
        window.requestAnimationFrame(fadePageInAsync);
      } else {
	let current_time = (new Date()).getTime() - start_time;
	let amnt = Math.max(0.0, Math.min(1.0,
					  fadeValue(true, current_time)
					 ));
        main_el.style.opacity = amnt;
	if (amnt == 1) {
	  start_time = -1.0;
	} else {	  
          window.requestAnimationFrame(fadePageInAsync);
	}
      }
    }

    const slideToTopOfPageAsync = () => {
      const offset = document.documentElement.scrollTop || document.body.scrollTop;

      if (offset > 0) {
	window.requestAnimationFrame(slideToTopOfPageAsync);
	window.scrollTo(0, offset-offset/10);
      }
    }

    const decorateNavigateTo = (fn) => {
      return () => {
	slideToTopOfPageAsync();
        const result = fn.apply(this, arguments);
	fadePageInAsync();
        return result;
      }
    }

    this.pinhole = decorateNavigateTo((e) => {
      router.navigateTo('/pinhole');
    });
    this.visualizer = decorateNavigateTo((e) => {
      router.navigateTo('/visualizer');
    });
    this.composition = decorateNavigateTo((e) => {
      router.navigateTo('/composition');
    });
    this.efarms = decorateNavigateTo((e) => {
      router.navigateTo('/ecosystems-farms');
    });
    this.prim = decorateNavigateTo((e) => {
      router.navigateTo('/prim');
    });
    this.lathe = decorateNavigateTo((e) => {
      router.navigateTo('/lathe');
    });
    this.ee = decorateNavigateTo((e) => {
      router.navigateTo('/ee');
    });
  }
);
