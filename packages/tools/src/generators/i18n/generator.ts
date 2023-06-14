import { formatFiles, generateFiles, getProjects, joinPathFragments, Tree } from '@nx/devkit';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { I18nGeneratorSchema } from './schema';

import { scanDir } from './internal/scan-dir';

const fileExtensions = ['ts', 'tsx'];
const outDir = 'locales';
const locales = ['en', 'ru', 'de'];
const defaultLocale = locales[0];

export async function i18nGenerator(tree: Tree, options: I18nGeneratorSchema) {
  const project = getProjects(tree).get(options.name);

  console.log(`\x1b[32mGenerate translations:\x1b[0m scan ${project.root} for ts/tsx files.`);

  const scanResult = scanDir(project.root, fileExtensions);

  const outputDir = joinPathFragments(project.root, outDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Merge results with existing translations
  for (const locale of locales) {
    let newPhrasesCount = 0;
    let previousResult = {};
    const localeResult = {};
    if (fs.existsSync(`${outputDir}/${locale}.js`)) {
      previousResult = require(path.resolve(process.cwd(), outputDir, `${locale}.js`));
    }

    // 1. add new translations
    for (const namespace in scanResult) {
      if (previousResult[namespace]) {
        localeResult[namespace] = {};
        for (const scope in scanResult[namespace]) {
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

export default i18nGenerator;
