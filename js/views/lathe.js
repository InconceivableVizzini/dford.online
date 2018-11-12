import riot from 'riot';

riot.tag('lathe',
  `
  <div class="column is-primary-column">
    <article>
      <div class="content">
        <h1>Designing a metal lathe</h1>
        <div><img src="/assets/img/gingerylathe3.png" alt="lathe" /></div>
        <p>I have wanted to design and build a metal lathe but did not have the tools or skills I needed to complete the project. Now that I have a bit of welding experience and am confident in constructing a decent foundry I&apos;ve decided to jump in. I&apos;m starting with designing the lathe.</p>
        <p>I don&apos;t have a lot of experience with CAD or CAM, and so far it has been a steep learning curve. I am using the free version of Fusion 360 to learn, along with a programmer-friendly CAD program called OpenSCAD.</p>
        <p>The design I have in mind are simple updates to an old design called the Gingery Lathe, designed by David J. Gingery. The lathe I want is similar in most respects, only &apos;modernized&apos; with variable speed spindles and electric drives.</p>
        <p>My first step will be to produce the Gingery design in Fusion 360. Once I can accurately produce a known specification I will be confident producing my own design in the software.</p>
        <p>So far I have completed the bed base, bed ways, compound slide base, and cross slide ways. Next will be the compound swivel base and compound slide, along with a simple quick change tool post so that the compound slide really looks the part.</p>
        <p>The Gingery lathe design CAD I am producing can be <a href="https://a360.co/2OOaSmR" target="_new">downloaded from the Fusion 360 Gallery</a>. As an aside, I really, really loathe this closed-source software and platform. You can&apos;t even save files locally. This is so frustrating and unneccessary... at least it costs nothing. I would love an open source alternative.</p>
         <img src="/assets/img/gingerylathe2.png" alt="lathe side" /><br />
      </div>
    </article>
  </div>
  `,

  function (opts) {
  }
);
