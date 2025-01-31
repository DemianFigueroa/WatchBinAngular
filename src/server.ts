import { CommonEngine } from '@angular/ssr/node';
import { APP_BASE_HREF } from '@angular/common';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import AppServerModule from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const commonEngine = new CommonEngine();

export async function netlifyCommonEngineHandler(request: Request, context: any): Promise<Response> {
  const url = new URL(request.url);
  const protocol = url.protocol;
  const originalUrl = url.pathname;
  const baseUrl = '/';

  const html = await commonEngine.render({
    bootstrap: AppServerModule,
    documentFilePath: indexHtml,
    url: `${protocol}//${url.host}${originalUrl}`,
    publicPath: browserDistFolder,
    providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}