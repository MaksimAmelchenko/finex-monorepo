import { formatFiles, generateFiles, getProjects, joinPathFragments, Tree } from '@nrwl/devkit';
import * as fs from 'fs';
import * as path from 'path';

import { scanDir } from './internal/scan-dir';

const fileExtensions = ['ts', 'tsx'];
const outDir = 'locales';
const locales = ['ru', 'en', 'de'];
const defaultLocale = locales[0];

export default async function (tree: Tree, schema: any) {
  // read project from workspace.json
  const project = getProjects(tree).get(schema.name);

  console.log(`\x1b[32mGenerate translations:\x1b[0m scan ${project.root} for ts/tsx files.`);

  const scanResult = scanDir(project.root, fileExtensions);

  const outputDir = joinPathFragments(project.root, outDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Merge results with existing translations
  for (let locale of locales) {
    let newPhrasesCount = 0;
    let previousResult = {};
    const localeResult = {};
    if (fs.existsSync(`${outputDir}/${locale}.js`)) {
      previousResult = require(path.resolve(process.cwd(), outputDir, `${locale}.js`));
    }

    // 1. add new translations
    for (let namespace in scanResult) {
      if (previousResult[namespace]) {
        localeResult[namespace] = {};
        for (let scope in scanResult[namespace]) {
          if (!previousResult[namespace][scope]) {
            newPhrasesCount += 1;
          }

          if (locale != defaultLocale || Object(localeResult[namespace][scope]) !== localeResult[namespace][scope]) {
            localeResult[namespace][scope] = previousResult[namespace][scope] || scanResult[namespace][scope];
          } else {
            localeResult[namespace][scope] = scanResult[namespace][scope];
          }
        }
      } else {
        localeResult[namespace] = scanResult[namespace];
      }
    }

    // sort result by namespaces
    const result = Object.keys(localeResult)
      .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
      .reduce((acc, key) => {
        acc[key] = localeResult[key];
        return acc;
      }, {});

    generateFiles(
      // virtual file system
      tree,
      // the location where the template files are
      joinPathFragments(__dirname, './files'),
      // where the files should be generated
      outputDir,
      // the variables to be substituted in the template
      {
        locale,
        data: JSON.stringify(result, null, 2),
        // remove __tmpl__ from file endings
        tmpl: '',
      }
    );

    console.log(`Translation file saved: ${outDir}/${locale}.js`);
    if (newPhrasesCount) {
      console.log(`\x1b[37m\x1b[44mNew ${newPhrasesCount} phrases for ${locale}\x1b[0m`);
    }
  }

  await formatFiles(tree);
}