let Watcher = require('./Watcher'),
    watchDir = './watch',
    processedDir  = './done',
    watcher = new Watcher(watchDir, processedDir);

watcher.start();
