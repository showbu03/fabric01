const s = require('shelljs');

s.rm('-rf', 'build');
s.mkdir('-p', 'build/server/blockchain/common');
s.mkdir('-p', 'build/server/blockchain/configuration');
s.mkdir('-p', 'build/server/blockchain/utils');
s.cp('.env', 'build/.env');
s.cp('-R', 'public', 'build/public');
s.cp('-R', 'server/blockchain/common/*', 'build/server/blockchain/common');
s.cp('-R', 'server/blockchain/configuration/*', 'build/server/blockchain/configuration');
s.cp('-R', 'server/blockchain/utils/*', 'build/server/blockchain/utils');
