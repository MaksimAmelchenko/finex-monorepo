import { NodeArray, Statement, SyntaxKind } from 'typescript';
import { normalizeKey } from './normalize';

const meaningfulKinds = {
  /*162*/ [SyntaxKind.PropertyDeclaration]: 'initializer',
  /*164*/ [SyntaxKind.MethodDeclaration]: 'body',
  /*165*/ [SyntaxKind.Constructor]: 'body',
  /*166*/ [SyntaxKind.GetAccessor]: 'body',
  /*167*/ [SyntaxKind.SetAccessor]: 'body',
  /*196*/ [SyntaxKind.ArrayLiteralExpression]: 'elements',
  /*197*/ [SyntaxKind.ObjectLiteralExpression]: 'properties',
  /*198*/ [SyntaxKind.PropertyAccessExpression]: 'expression',
  /*199*/ [SyntaxKind.ElementAccessExpression]: ['expression'],
  /*200*/ [SyntaxKind.CallExpression]: ['expression', 'arguments'],
  /*204*/ [SyntaxKind.ParenthesizedExpression]: 'expression',
  /*206*/ [SyntaxKind.ArrowFunction]: 'body',
  /*213*/ [SyntaxKind.BinaryExpression]: ['left', 'right'],
  /*214*/ [SyntaxKind.ConditionalExpression]: ['condition', 'whenTrue', 'whenFalse'],
  /*215*/ [SyntaxKind.TemplateExpression]: 'templateSpans',
  /*225*/ [SyntaxKind.TemplateSpan]: 'expression',
  /*227*/ [SyntaxKind.Block]: 'statements', // scan code-block statements (e.g. function body)
  /*228*/ [SyntaxKind.AsExpression]: ['expression'],
  /*229*/ [SyntaxKind.VariableStatement]: 'declarationList', // scan const/let/var declaration
  /*230*/ [SyntaxKind.ExpressionStatement]: 'expression',
  /*231*/ [SyntaxKind.IfStatement]: ['thenStatement', 'elseStatement'],
  /*232*/ [SyntaxKind.DoStatement]: 'expression',
  /*233*/ [SyntaxKind.WhileStatement]: 'expression',
  /*234*/ [SyntaxKind.ForStatement]: 'statement',
  /*235*/ [SyntaxKind.ForInStatement]: ['statement', 'expression'],
  /*236*/ [SyntaxKind.ForOfStatement]: ['statement', 'expression'],
  /*239*/ [SyntaxKind.ReturnStatement]: 'expression',
  /*241*/ [SyntaxKind.SwitchStatement]: ['expression', 'caseBlock'],
  /*243*/ [SyntaxKind.ThrowStatement]: ['expression'],
  /*244*/ [SyntaxKind.TryStatement]: ['tryBlock', 'catchClause', 'finallyBlock'],
  /*246*/ [SyntaxKind.VariableDeclaration]: 'initializer', // scan cont/let/var initializer
  /*247*/ [SyntaxKind.VariableDeclarationList]: 'declarations', // continue const/let/var declaration scanning
  /*248*/ [SyntaxKind.FunctionDeclaration]: 'body', // scan function body
  /*249*/ [SyntaxKind.ClassDeclaration]: ['members'],
  /*255*/ [SyntaxKind.CaseBlock]: ['clauses'],
  /*270*/ [SyntaxKind.JsxElement]: ['openingElement', 'closingElement', 'children'],
  /*271*/ [SyntaxKind.JsxSelfClosingElement]: ['attributes'],
  /*272*/ [SyntaxKind.JsxOpeningElement]: 'attributes',
  /*274*/ [SyntaxKind.JsxFragment]: ['children'],
  /*277*/ [SyntaxKind.JsxAttribute]: 'initializer',
  /*278*/ [SyntaxKind.JsxAttributes]: 'properties',
  /*280*/ [SyntaxKind.JsxExpression]: 'expression',
  /*281*/ [SyntaxKind.CaseClause]: ['statements'],
  /*282*/ [SyntaxKind.DefaultClause]: ['statements'],
  /*284*/ [SyntaxKind.CatchClause]: ['block'],
  /*285*/ [SyntaxKind.PropertyAssignment]: 'initializer',
};

const translationFunction = 't';

export function scanNodes(nodes: NodeArray<Statement>, path: string, content: string) {
  return nodes
    .filter(node => !!node)
    .reduce((prev, node) => {
      // If current node is meaningful for us then scan subordinance node(s)
      // console.log(meaningfulKinds[node.kind], node);
      if (meaningfulKinds[node.kind]) {
        if (isSearchedFunction(node)) {
          if (isArgumentRight(node)) {
            const text = extractTranslatedText(node).replace(/\\([\s\S])|("'")/g, '\\$1$2');
            prev[normalizeKey(text)] = text;
            return prev;
          } else {
            console.warn(
              `${path} Translator function first argument should always be string literal, but found this: ${extractFirstArgument(
                node,
                content,
              )}`,
            );
          }
        } else if (meaningfulKinds[node.kind]) {
          const attributesToScan = Array.isArray(meaningfulKinds[node.kind])
            ? meaningfulKinds[node.kind]
            : [meaningfulKinds[node.kind]];

          return attributesToScan.reduce((prev, attributeName) => {
            return {
              ...prev,
              ...scanNodes(
                Array.isArray(node[attributeName]) ? node[attributeName] : [node[attributeName]],
                path,
                content,
              ),
            };
          }, prev);
        }
      }
      return prev;
    }, {});
}

function isSearchedFunction(node: any) {
  return (
    node.kind === SyntaxKind.CallExpression &&
    node.expression &&
    node.expression.kind === SyntaxKind.Identifier &&
    (node.expression as any).escapedText === translationFunction
  );
}

function isArgumentRight(node: any) {
  return (node as any).arguments[0] && (node as any).arguments[0].kind === SyntaxKind.StringLiteral;
}

function extractTranslatedText(node: any) {
  return node.arguments[0] && (node.arguments[0] as any).text;
}

function extractFirstArgument(node: any, content: string) {
  const argument = (node as any).arguments[0];

  if (!argument) {
    return 'No arguments given';
  }
  return content.substring(node.arguments[0].start, node.arguments[0].end);
}
