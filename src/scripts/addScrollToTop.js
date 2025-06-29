const fs = require('fs').promises;
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');

async function addScrollToTop(pagePath) {
    try {
        const content = await fs.readFile(pagePath, 'utf-8');
        
        // Add import if not exists
        if (!content.includes('import { useScrollToTop } from \'../hooks/useScrollToTop\'')) {
            const newContent = content.replace(
                'import React from \'react\'\n',
                'import React from \'react\'\nimport { useScrollToTop } from \'../hooks/useScrollToTop\'\n'
            );
            
            // Add hook usage if not exists
            const hookUsage = '    useScrollToTop();\n    \n';
            const componentStart = newContent.indexOf('const') + 5;
            const componentEnd = newContent.indexOf(' =') + 2;
            const componentName = newContent.substring(componentStart, componentEnd);
            
            if (!newContent.includes('useScrollToTop();')) {
                const newContentWithHook = newContent.replace(
                    `${componentName} = () => {`,
                    `${componentName} = () => {\n${hookUsage}`
                );
                
                await fs.writeFile(pagePath, newContentWithHook);
                console.log(`Updated ${path.basename(pagePath)}`);
            }
        }
    } catch (error) {
        console.error(`Error processing ${path.basename(pagePath)}:`, error);
    }
}

async function processPages() {
    try {
        const files = await fs.readdir(pagesDir);
        for (const file of files) {
            if (file.endsWith('.jsx')) {
                const filePath = path.join(pagesDir, file);
                await addScrollToTop(filePath);
            }
        }
        console.log('Finished processing pages');
    } catch (error) {
        console.error('Error processing pages:', error);
    }
}

processPages();
