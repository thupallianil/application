const fs = require('fs');
const files = fs.readdirSync('src/pages/settings');
files.filter(f => f.endsWith('.jsx')).forEach(f => {
    const code = fs.readFileSync('src/pages/settings/' + f, 'utf8');
    const match = code.match(/useState\(\{\s*([\s\S]+?)\s*\}\)/);
    if (match) {
        console.log(f + ':');
        console.log(match[1].split(',').map(l => l.trim().split(':')[0]).filter(k => k).join(', '));
    }
})
