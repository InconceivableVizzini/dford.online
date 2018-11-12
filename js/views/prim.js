import riot from 'riot';

var hljs = require('../../node_modules/highlight.js/lib/index.js');

riot.tag('prim',
  `
  <div class="column is-primary-column">
    <article>
      <div class="content">
        <h1>Creating a math-focused programming language.</h1>
        <p>For a long time I&apos;ve toyed with the idea of writing a compiler for a math-focused programming language. Recently I have been writing code related to neural networks, and it has become clear that it would be nice if a language supported both symbolic and numeric analysis as first-class citizens.</p>
        <p>It would be nice to be able to write code that supports vectorization without the hassle of dealing with SSE intrinsics. Supporting vectorization without verbose looping would make writing linear algebra-related code much more succinct.</p>
	<pre>
<code class="python">vec fn mul(x, y)
    return x * y

a = [1, 2, 3]
b = [1, 2, 3]
         
// element-wise multiplication, no looping required.
c = mul(a, b) // [1, 4, 9]         
</code>
        </pre>
        <p>Another nicety would be to perform algebra on symbols directly and avoid implementation-detail quirkiness such as those relating to real number line approximations.</p>
        <pre>
<code class="plaintext">sym a = 2^53
sym b = a + 1
c = 2^53
d = c + 1
a == b // False
c == d // True, 2^53 + 1 cannot be represented, so d is
       // assigned the value 2^53.
</code>
        </pre>
        <p>This language should read something like a mixture of mathematics and conventional code. Operators such as &Hat; become their mathy counterparts rather than logical operations. Identifiers may include unicode characters, so a sigmoid function may be defined using a lowercase sigma, &sigma;. Summation might be performed using uppercase &Sigma;, and so forth.</p>
        <pre>
<code class="plaintext">fn σ(activation)
    return 1.0/(1.0+e(-activation))

fn σ'(activation)
    return σ(activation)*(1-σ(activation))

fn quadratic_cost(actual, desired)
    return 0.5*norm(actual-desired)^2

fn quadratic_cost_error(activation, actual, desired)
    return (actual-desired)*σ'(activation)

fn cross_entropy_cost(actual, desired)
    return -desired*ln(actual)-(1-desired)*ln(1-actual)

fn cross_entropy_error(actual, desired)
    return actual-desired
</code>
        </pre>
        <p>I have not decided where I stand on a lot of syntax features. In the example above I refer to the derivative of the sigmoid function using &sigma;&apos;, but quotes may prove problematic inside identifiers. I use norm() for the normal of a length, but 0.5*|actual-desired|^2 is the more mathy way to represent the same thing. I am just going to experiment and see what sticks. I do not expect this prototype language will find any practical use, so the syntax sky is the limit.</p>
        <p>In order to iterate quickly I have chosen to write this compiler using Python. A lot of useful numeric analysis tools are provided by the python library numpy, and for symbolic analysis we can use sympy. I have decided to call this language Prim.</p>
        <p>The first prim program is just a few assignment statements and a comment, but it allows me to hit a few things in the lexer/parser that I want to implement such as line continuation and unicode identifiers.</p>         
        <pre>
<code class="plaintext">// This is a comment. \\
   It is a multi-line comment. \\
   \\
   \\
   arr = 2

arr = 1

unicöde = 1.
π-real = 3.14159265359
sym pi = π
</code>
        </pre>
        <h1>Producing an AST using a Lexer and Parser</h1>
        <p>The first phase of compilation is called lexical analysis. This is when you take a stream of input and turn it into a set of tokens, identifying what type of thing each piece of input is. A token might be a number, or an identifier for a variable or function. The second phase, parsing, is taking that set of tokens and grouping them logically into a tree structure called an Abstract Syntax Tree. Each Node or set of Nodes of this tree describes a part of a program, such as a variable declaration or a function definition. The result is a large tree structure that describes the constructs of your application.</p>
        <p>Python has a nice implementation of the parsing tools lex and yacc called ply. These tools make it easy to implement both lexical analysis and parsing.</p>
        <p>The lexer implementations I have read all had no internal state, but I am not sure how I could implement offside-rule and other language features without keeping track of a few variables such as when the lexer reaches the start of a line. The only way I can accomplish a stateless lexer is to push those features into the parser, but that is a complexity trade-off for the parser that I am unwilling to do, considering even with statefulness the lexer is incredibly simple.</p>
        <h1>Code Generation and Compilation</h1>
        <p>The next phase takes this large tree structure and generates machine code for the architecture the code needs to run on. Often there is a middle step where some form of assembly code is generated. I have chosen to use a set of compiler tools called LLVM, generating an intermediate representation code called LLVM IR that is then converted to machine code for a given architecture. LLVM provides a lot of nice-to-haves for free, such as code optimization and static analysis.</p>
        <p>There are a lot of parts to LLVM and I have a great deal to learn. I am happy to be learning this using Python rather than the verbosity of LLVM C++ APIs.</p>
        <h1>First program</h1>
        <p>The first compiled prim program is not very interesting.</p>


        <pre>
<code class="plaintext">derek@dev:prim/$ primc test/hello-world.pr
Code Generator failed to grok unknown AST node type: block
Code Generator failed to grok unknown AST node type: statements
Code Generator failed to grok unknown AST node type: statements
Code Generator failed to grok unknown AST node type: statements
Code Generator failed to grok unknown AST node type: assignment_statement
Code Generator failed to grok unknown AST node type: identifier
Code Generator failed to grok unknown AST node type: number
Code Generator failed to grok unknown AST node type: assignment_statement
Code Generator failed to grok unknown AST node type: identifier
Code Generator failed to grok unknown AST node type: number
Code Generator failed to grok unknown AST node type: assignment_statement
Code Generator failed to grok unknown AST node type: identifier
Code Generator failed to grok unknown AST node type: number
Code Generator failed to grok unknown AST node type: assignment_statement
Code Generator failed to grok unknown AST node type: qualified_identifier
Code Generator failed to grok unknown AST node type: identifier
Code Generator failed to grok unknown AST node type: identifier
Code Generator failed to grok unknown AST node type: identifier
; ModuleID = 'prim'

declare void @printf(i8*, ...)

define i32 @main(i32, i8**) \\{
entry:
  ret i32 0
}

derek@dev:prim/$ ./a.out
derek@dev:prim/$ echo $?
0
derek@dev:prim/$
</code>
        </pre>
        <p>At this point the compiler only knows how to generate llvm intermediate representation code for the Program node type in the AST, so the only thing that ends up in the resulting binary is a main function that returns 0.</p>
        <p>It is a program that effectively does nothing, but it is a program that runs on my machine, so I am pleased with the results so far.</p>
        <h1>Next goals</h1>
        <p>The next steps will be to add support in the code generator for the first basic AST node types, and to add node types for function calls so a basic prim program can be compiled that will assign and output a value.</p>
        <p>Prim can be found on GitHub at <a href="https://github.com/InconceivableVizzini/prim" target="_new">InconceivableVizzini/prim</a>.</p>
      </div> 
    </article>
  </div>
  `,

  function (opts){
    this.on('mount', () => {
      hljs.initHighlighting();
    });
  }
);
