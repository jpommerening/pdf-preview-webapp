import 'pdfjs-dist/web/compatibility';

import pdfjs from 'pdfjs-dist/build/pdf';
import PdfjsWorker from 'worker-loader!pdfjs-dist/build/pdf.worker';

if( typeof window !== 'undefined' && 'Worker' in window ) {
   pdfjs.PDFJS.workerPort = new PdfjsWorker();
}
else {
   pdfjs.PDFJS.disableWorker = true;
}
