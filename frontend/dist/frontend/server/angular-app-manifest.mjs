
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/vehicles"
  },
  {
    "renderMode": 2,
    "route": "/payments"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23562, hash: 'a22b9fde591e3c17b6c264280092f408f94db243c6f3a3c8d91ef3ec92ee466d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17136, hash: '7f510e1e02a7ddd875247eedc540a6f299c6d0102994f8447203ebf091eaca12', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 27264, hash: '82d9c0f5f107fcbf61ede1a5afed48ad3bfc34fc41f797ea8604c1c453fc202e', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'vehicles/index.html': {size: 27264, hash: '82d9c0f5f107fcbf61ede1a5afed48ad3bfc34fc41f797ea8604c1c453fc202e', text: () => import('./assets-chunks/vehicles_index_html.mjs').then(m => m.default)},
    'payments/index.html': {size: 27264, hash: '82d9c0f5f107fcbf61ede1a5afed48ad3bfc34fc41f797ea8604c1c453fc202e', text: () => import('./assets-chunks/payments_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 27264, hash: '82d9c0f5f107fcbf61ede1a5afed48ad3bfc34fc41f797ea8604c1c453fc202e', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
