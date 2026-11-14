import { existsSync, cpSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
const candidates=[resolve(process.cwd(),'../standalone/site/assets'),resolve(process.cwd(),'standalone/site/assets')];
const source=candidates.find(existsSync);
if(!source){console.log('Legacy assets not present. The standalone Next.js preview can still run.');process.exit(0);}
const destination=resolve(process.cwd(),'public/assets');
mkdirSync(destination,{recursive:true});
cpSync(source,destination,{recursive:true,force:true});
console.log('Copied existing site assets and downloadable worksheets to public/assets.');
