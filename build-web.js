const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building Cocos Creator project for web...');

try {
    // Build project using Cocos Creator CLI
    const projectPath = path.join(__dirname, 'clientgo88sfun');
    const buildPath = path.join(projectPath, 'build', 'web-mobile');
    
    // Command to build Cocos Creator project
    const buildCommand = `"C:\\Program Files\\CocosCreator\\CocosCreator.exe" --path "${projectPath}" --build "platform=web-mobile;debug=false;optimize=true"`;
    
    console.log('Executing build command...');
    execSync(buildCommand, { stdio: 'inherit' });
    
    // Update API URL in built files for production
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Replace localhost API URL with production URL
        indexContent = indexContent.replace(
            /http:\/\/localhost:3000\/api/g,
            'https://your-backend-url.render.com/api'
        );
        
        fs.writeFileSync(indexPath, indexContent);
        console.log('Updated API URLs for production');
    }
    
    console.log('Build completed successfully!');
    console.log(`Build output: ${buildPath}`);
    
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}