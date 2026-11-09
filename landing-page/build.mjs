import { build as viteBuild } from 'vite';
import { build as bundle } from 'esbuild';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
await viteBuild();
const temp=path.resolve('.render.mjs');
try {
 await bundle({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',outfile:temp,external:['react','react-dom/server'],loader:{'.png':'dataurl','.svg':'dataurl','.webp':'dataurl'},jsx:'automatic'});
 const {default:App}=await import(pathToFileURL(temp).href+'?t='+Date.now());
 const markup=renderToString(React.createElement(App));
 let html=(await readFile('dist/index.html','utf8')).replace(/\r\n?/g,'\n');
 html=html.replace('<div id="root"></div>',()=>'<div id="root">'+markup+'</div>');
 await writeFile('dist/index.html',html);
 const target=path.resolve('../standalone/site');
 await mkdir(target,{recursive:true});
 await writeFile(path.join(target,'index.html'),html);
 await copyFile('public/favicon.svg',path.join(target,'assets/favicon.svg'));
 console.log('Prerendered homepage saved to standalone/site/index.html');
} finally {await rm(temp,{force:true})}
