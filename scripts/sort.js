const fs = require('fs');
const readline = require('readline');
const os = require('os');

const lines = [];

const rl = readline.createInterface({
    input: fs.createReadStream('../loss_unet_log.txt'),
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    const head = lines.shift();
    
    function getData(text) {
        const [index1, index2] = [text.indexOf('epoch: '), text.indexOf(', iters')];
        const [index3, index4] = [text.indexOf('iters: '), text.indexOf(', time')];
        return [
            text.slice(index1 + 7, index2),
            text.slice(index3 + 7, index4)
        ].map(item => parseInt(item));
    }

    lines.sort((a, b) => {
        const [epoch_a, iter_a] = getData(a);
        const [epoch_b, iter_b] = getData(b);

        if (epoch_a < epoch_b) return -1;
        else if (epoch_a > epoch_b) return 1;
        else {
            if (iter_a < iter_b) return -1;
            else if (iter_a > iter_b) return 1;
            else return 0
        } 
    });

    lines.unshift(head);

    const content = lines.join(os.EOL);

    fs.writeFileSync('./loss_unet_log_format.txt', content);
})
