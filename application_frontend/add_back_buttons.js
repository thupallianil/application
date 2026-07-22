const fs = require('fs');
const path = require('path');

const dirs = [
    'src/pages/clients',
    'src/pages/quotations',
    'src/pages/invoices',
    'src/pages/payments'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file.match(/^(Add|Edit|View|QuoteDetails|InvoiceDetails|PaymentDetails).*\.jsx$/)) {
            let content = fs.readFileSync(path.join(dir, file), 'utf8');

            // Check if button already injected
            if (content.includes('onClick={() => navigate(-1)}')) return;

            // Add imports if missing
            if (!content.includes('useNavigate')) {
                content = content.replace(/import\s+(.*?)\s+from\s+('|\")react('|\");/, `import $1 from 'react';\nimport { useNavigate } from 'react-router-dom';`);
            }
            if (!content.includes('ArrowLeft')) {
                content = content.replace(/import\s+(.*?)\s+from\s+('|\")react('|\");/, `import $1 from 'react';\nimport { ArrowLeft } from 'lucide-react';`);
            }

            // Add navigate if missing
            if (!content.includes('const navigate = useNavigate();') && !content.includes('const navigate =')) {
                content = content.replace(/export default function (\w+)\(\)\s*\{/, `export default function $1() {\n  const navigate = useNavigate();\n`);
            }

            // Replace h1 with flex container
            content = content.replace(/<h1(.*?)>(.*?)<\/h1>/s, (match, p1, p2) => {
                // remove mb-* from h1 class if exists because we put it on container
                let newP1 = p1.replace(/mb-\d+/, '');
                return `<div className="flex justify-between items-start mb-6 w-full">
        <h1${newP1}>${p2}</h1>
        <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer shrink-0" title="Go Back">
          <ArrowLeft size={18} />
        </button>
      </div>`;
            });

            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log(`Updated ${file}`);
        }
    });
});
