import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { toast } from 'react-toastify';

/**
 * downloadAsPDF(elementId, filename)
 * Converts the element with the given ID to a PDF and downloads it directly.
 */
export async function downloadAsPDF(elementId, filename = 'document.pdf') {
    const el = document.getElementById(elementId);
    if (!el) {
        console.error(`Element with id "${elementId}" not found`);
        toast.error("Document content not found.");
        return;
    }

    try {
        toast.info("Generating PDF, please wait...", { autoClose: 2000 });

        const originalStyle = el.style.cssText;
        el.style.background = 'white';

        // Capture HTML as PNG image using native browser logic (bypasses html2canvas css parsing crashes like "oklch")
        const imgData = await toPng(el, {
            quality: 0.98,
            pixelRatio: 2,
            backgroundColor: '#ffffff'
        });

        el.style.cssText = originalStyle;

        // Load image to get original aspect ratio
        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => { img.onload = resolve; });

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        // Calculate PDF proportions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Download
        pdf.save(filename);
        toast.success("PDF Downloaded successfully!");
    } catch (error) {
        console.error("PDF Generation error:", error);
        toast.error(`PDF Error: ${error?.message || String(error)}`, { autoClose: 10000 });
    }
}
