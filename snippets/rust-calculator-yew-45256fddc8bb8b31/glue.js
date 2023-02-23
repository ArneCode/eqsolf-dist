
export function make_latex_input(id) {
  //hack, to wait for the element to be added to html
  requestAnimationFrame(() => {
    //console.log(document.body.innerHTML);
    let elt = document.getElementById(id);
    mathfield = MQ.MathField(elt, {
      spaceBehavesLikeTab: false,
      charsThatBreakOutOfSupSub: '+-=<>', handlers: {
        /*enter: () => {
          elt.parentNode.submit()
        }*/
        edit: function () {
          window.sessionStorage.setItem("mainEquationLatex", mathfield.latex())
        },
      }
    })
    mathfield.latex(window.sessionStorage.getItem("mainEquationLatex") || "x^2=4")
    console.log("making mathfield input", elt, id)
  })
}
export function pre_format_latex(latex) {
  return latex.replace(/(\\[a-z]+)(\d+)/, "$1 $2").replace(/\\right\./, "");
}
export function get_input_latex() {
  let latex = mathfield.latex();
  //mathquill turns "times three" into "\cdot3", this inserts a space between command and number
  latex = latex.replace(/(\\[a-z]+)(\d+)/, "$1 $2");
  //sometimes a \right. is inserted, this removes it
  latex = latex.replace(/\\right\./, "");
  console.log("mathfield latex: ", latex);
  return latex;
}
export function get_elt_value(id) {
  return document.getElementById(id).value
}
export function set_elt_value(id, value) {
  document.getElementById(id).value = value
}
export function render_latex(latex) {
  console.log("rendering latex: ", latex);
  return katex.renderToString(latex);
}
export function render_tree(structure, id) {
  console.log(`rendering tree: '${structure}' in ${id}`);
  let config = {
    chart: {
      container: "#" + id,
      connectors: {
        type: 'straight'
      },
      rootOrientation: "EAST",
    },
    nodeStructure: JSON.parse(structure)
  };
  setTimeout(() => {
    new Treant(
      config,
      function () {
        console.log("tree rendered, config:", config);
      }
    )
  }, 0, $)
}
