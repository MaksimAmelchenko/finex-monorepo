import { NodeArray, Statement, SyntaxKind } from 'typescript';
import { normalizeKey } from './normalize';

const meaningfulKinds = {
  [SyntaxKind.PropertyDeclaration]: 'initializer',
  [SyntaxKind.MethodDeclaration]: 'body',
  [SyntaxKind.Constructor]: 'body',
  [SyntaxKind.GetAccessor]: 'body',
  [SyntaxKind.SetAccessor]: 'body',
  [SyntaxKind.ArrayLiteralExpression]: 'elements',
  [SyntaxKind.ObjectLiteralExpression]: 'properties',
  [SyntaxKind.PropertyAccessExpression]: 'expression',
  [SyntaxKind.ElementAccessExpression]: ['expression'],
  [SyntaxKind.CallExpression]: ['expression', 'arguments'],
  [SyntaxKind.ParenthesizedExpression]: 'expression',
  [SyntaxKind.ArrowFunction]: 'body',
  [SyntaxKind.BinaryExpression]: ['left', 'right'],
  [SyntaxKind.ConditionalExpression]: ['condition', 'whenTrue', 'whenFalse'],
  [SyntaxKind.TemplateExpression]: 'templateSpans',
  [SyntaxKind.TemplateSpan]: 'expression',
  [SyntaxKind.Block]: 'statements', // scan code-block statements (e.g. function body)
  [SyntaxKind.AsExpression]: ['expression'],
  [SyntaxKind.VariableStatement]: 'declarationList', // scan const/let/var declaration
  [SyntaxKind.ExpressionStatement]: 'expression',
  [SyntaxKind.IfStatement]: ['expression', 'thenStatement', 'elseStatement'],
  [SyntaxKind.PrefixUnaryExpression]: ['operand'],
  [SyntaxKind.DoStatement]: 'expression',
  [SyntaxKind.WhileStatement]: 'expression',
  [SyntaxKind.ForStatement]: 'statement',
  [SyntaxKind.ForInStatement]: ['statement', 'expression'],
  [SyntaxKind.ForOfStatement]: ['statement', 'expression'],
  [SyntaxKind.ReturnStatement]: 'expression',
  [SyntaxKind.SwitchStatement]: ['expression', 'caseBlock'],
  [SyntaxKind.ThrowStatement]: ['expression'],
  [SyntaxKind.TryStatement]: ['tryBlock', 'catchClause', 'finallyBlock'],
  [SyntaxKind.VariableDeclaration]: 'initializer', // scan cont/let/var initializer
  [SyntaxKind.VariableDeclarationList]: 'declarations', // continue const/let/var declaration scanning
  [SyntaxKind.FunctionDeclaration]: 'body', // scan function body
  [SyntaxKind.ClassDeclaration]: ['members'],
  [SyntaxKind.CaseBlock]: ['clauses'],
  [SyntaxKind.JsxElement]: ['openingElement', 'closingElement', 'children'],
  [SyntaxKind.JsxSelfClosingElement]: ['attributes'],
  [SyntaxKind.JsxOpeningElement]: 'attributes',
  [SyntaxKind.JsxFragment]: ['children'],
  [SyntaxKind.JsxAttribute]: 'initializer',
  [SyntaxKind.JsxAttributes]: 'properties',
  [SyntaxKind.JsxExpression]: 'expression',
  [SyntaxKind.CaseClause]: ['statements'],
  [SyntaxKind.DefaultClause]: ['statements'],
  [SyntaxKind.CatchClause]: ['block'],
  [SyntaxKind.PropertyAssignment]: 'initializer',
  [SyntaxKind.NewExpression]: 'arguments',
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
                content
              )}`
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
                content
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
