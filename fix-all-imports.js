// Script to fix all module/ imports to relative paths
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all module/ imports to relative paths...');

function findFiles(dir, extension = '.ts') {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
            files = files.concat(findFiles(fullPath, extension));
        } else if (stat.isFile() && item.endsWith(extension)) {
            files.push(fullPath);
        }
    }
    
    return files;
}

function fixImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Fix module/ imports
    const moduleImportRegex = /import\s+.*\s+from\s+['"](module\/[^'"]+)['"]/g;
    const matches = content.match(moduleImportRegex);
    
    if (matches) {
        matches.forEach(match => {
            const importPath = match.match(/['"](module\/[^'"]+)['"]/)[1];
            const relativePath = importPath.replace('module/', '../');
            const newImport = match.replace(importPath, relativePath);
            newContent = newContent.replace(match, newImport);
            hasChanges = true;
            console.log(`  ✅ Fixed: ${importPath} → ${relativePath}`);
        });
    }
    
    if (hasChanges) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`📄 Updated: ${filePath}`);
        return true;
    }
    
    return false;
}

// Find all TypeScript files
const files = findFiles('./module', '.ts');
console.log(`📁 Found ${files.length} TypeScript files`);

let fixedFiles = 0;

files.forEach(file => {
    if (fixImports(file)) {
        fixedFiles++;
    }
});

console.log(`\n✅ Fixed ${fixedFiles} files`);
console.log('🎉 All module/ imports have been converted to relative paths!');
