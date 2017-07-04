import riot from 'riot';

riot.tag('pinhole',
  `
  <div class="column is-12 is-primary-column">
    <article class="media">
      <div class="media-content is-squished">
        <div class="content">
          <p>Pinhole is a text-based terminal adventure set in the <a href="http://www.eclipsephase.com/" target="_new">Eclipse Phase</a> universe.</p>
          <p>Pinhole is available on GitHub, <a href="https://github.com/InconceivableVizzini/pinhole" target="_new">InconceivableVizzini/pinhole</a>.</p>
        </div> 
      </div>
      <figure class="media-right">
        <p class="image"><img src="/assets/img/pclaptop.svg" class="is-tilted" /></p>
      </figure>
    </article>
  </div>
  `,

  function (opts){
    this.on('mount', () => {
      document.body.classList.add('is-pinhole-active');
    });
    this.on('unmount', () => {
      document.body.classList.remove('is-pinhole-active');
    });
  }
);
