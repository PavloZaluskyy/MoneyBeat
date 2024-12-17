import { createWorker } from 'tesseract.js';


export class Tes {
    async tessar(imageFile) {
        const worker = await createWorker('ukr');
        const ret = await worker.recognize(imageFile);
        console.log(ret.data.text);
        await worker.terminate();
        return ret.data.text;
      }
}
