import { toPng } from 'html-to-image';

export async function exportReceiptAsPng(element: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    backgroundColor: '#f4f1e8',
    cacheBust: true,
    style: {
      borderRadius: '0',
      boxShadow: 'none',
    },
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
