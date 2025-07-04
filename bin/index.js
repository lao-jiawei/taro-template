#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { handler, basePageFiles } = require('../template_creator');

program
  .version('1.0.0')
  .argument('<project-name>', 'Name of the project to create')
  .option('-t, --typescript', 'Use TypeScript template')
  .option('-p, --page <name>', 'Set initial page name', 'index')
  .action(async (projectName, options) => {
    const targetDir = path.resolve(process.cwd(), projectName);

    // Check if directory exists
    if (await fs.pathExists(targetDir)) {
      console.error(`Error: Directory ${projectName} already exists`);
      process.exit(1);
    }

    try {
      // Create target directory
      await fs.mkdirp(targetDir);

      // Copy base template files
      const templateDir = path.resolve(__dirname, '..');
      await fs.copy(templateDir, targetDir);

      // Process template files with handler
      const params = {
        typescript: options.typescript,
        pageName: options.page
      };

      for (const [filePath, transform] of Object.entries(handler)) {
        const fullPath = path.join(targetDir, filePath);
        if (await fs.pathExists(fullPath)) {
          const result = transform(params);
          if (result === false) {
            await fs.remove(fullPath);
          } else if (typeof result === 'object' && result.setPageName) {
            const newPath = path.join(targetDir, result.setPageName);
            await fs.mkdirp(path.dirname(newPath));
            await fs.move(fullPath, newPath);
          }
        }
      }

      // Update package.json with project name
      const packageJsonPath = path.join(targetDir, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      console.log(`Successfully created project ${projectName}`);
      console.log('To get started:');
      console.log(`  cd ${projectName}`);
      console.log('  npm install');
      console.log('  npm run dev:weapp');
    } catch (err) {
      console.error('Error creating project:', err);
      await fs.remove(targetDir); // Clean up on error
      process.exit(1);
    }
  });

program.parse(process.argv);