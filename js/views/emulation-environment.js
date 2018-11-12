import riot from 'riot';

riot.tag('ee',
  `
  <div class="column is-primary-column">
    <article>
      <div class="content">
        <h1>A set of tools for exploring old chipsets</h1>
        <p>I&apos;m very interested in how older programs were written, and how computer architectures were designed and functioned. One of my future projects will definitely be building my own 8 bit microprocessor. For now I have written an emulator for the intel 8080 microprocessor and tied it to a GUI for stepping around and disassembling 8080 machine code.</p>
        <p>As it stands the little amount of GUI doesn&apos;t allow for very useful tools for reversing or understanding old code that runs on the 8080 chip, such as Space Invaders. A lot more time will have to be invested but it will be nice to have an interactive reverse engineering tool to apply.</p>

        <h1>Next goals</h1>
         <p>I&apos;m going to separate the chip implementation from the gui a bit more. Right now the chip is implemented in cpp, but it&apos;s also of prototype quality. I intend to write the chip implementation in c, and to stop using Qt-provided thread interfaces and data structures.</p>
	 <p>The UI needs to be expanded to allow applying identifiers to memory addresses. This way known parts of applications such as functions or variables can be labeled, making it easier to identify the purpose of unknown code.</p>
        <p>As this progresses I want to apply the llvm know-how I&apos;ve been developing and end up with a full set of development tools for the 8080 chip - a c compiler, assembler, and so forth.</p>
         <p>EE can be found on GitHub at <a href="https://github.com/InconceivableVizzini/emulation-environment" target="_new">InconceivableVizzini/emulation-environment</a>.</p>
      </div> 
    </article>
  </div>
  `,

  function (opts){
  }
);
