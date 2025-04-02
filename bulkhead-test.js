const { Worker, isMainThread, parentPort } = require('worker_threads');
const axios = require('axios');

const URL = 'http://localhost:8080/api/bulkhead';
const NUM_THREADS = 12;

if (isMainThread) {
    console.log(`Iniciando ${NUM_THREADS} threads para testar bulkhead...\n`);

    for (let i = 0; i < NUM_THREADS; i++) {
        const worker = new Worker(__filename);
        
        worker.on('message', (message) => {
            console.log(`Thread ${i + 1}: ${message}`);
        });

        worker.on('error', (err) => {
            console.error(`Erro na Thread ${i + 1}:`, err);
        });

        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Thread ${i + 1} retornou código ${code}`);
        });
    }
} else {
    axios.get(URL)
        .then(response => parentPort.postMessage(`Sucesso: ${response.data}`))
        .catch(error => parentPort.postMessage(`Erro: ${error.response?.data || error.message}`));
}