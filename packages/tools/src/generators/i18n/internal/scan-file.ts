import * as fs from 'fs';
import * as ts from 'typescript';
import { NodeArray, Statement, SyntaxKind } from 'typescript';

import { scanNodes } from './scan-nodes';

const getTFunctionName = 'getT';

export function scanFile(path: string) {
  const content = fs.readFileSync(path, 'utf8');
  const tsFile = ts.createSourceFile(path, content, ts.ScriptTarget.ES5, false, ts.ScriptKind.TSX);
  const fileScanResult = scanNodes(tsFile.statements, path, content);
  if (Object.keys(fileScanResult).length > 0) {
    const namespace = extractScope(tsFile.statements);
    if (!namespace) {
      console.warn(`${path}: cannot find "const t = getT('scope') call!"`);
    }
    return { [namespace]: fileScanResult };
  }
  return {};
}

function extractScope(nodes: NodeArray<Statement>): string {
  const getTCall = nodes.find(
    (node: any) =>
      node.kind === SyntaxKind.VariableStatement &&
      node.declarationList.declarations[0] &&
      node.declarationList.declarations[0].initializer &&
      node.declarationList.declarations[0].initializer.kind === SyntaxKind.CallExpression &&
      node.declarationList.declarations[0].initializer.expression.escapedText === getTFunctionName
  );

  if (getTCall) {
    return (getTCall as any).declarationList.declarations[0].initializer.arguments[0].text;
  }

  return '';
}
