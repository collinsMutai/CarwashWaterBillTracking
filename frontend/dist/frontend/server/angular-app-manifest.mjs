
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
    'index.csr.html': {size: 23562, hash: '5520a36f6d95896fbb0b1f68d7902c1785b87884b0b04c16302c6c2fa80d5051', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17136, hash: '7cae5fc00f8afacd7c6d4c58b85c422ac9c2388f1e994e8c06f771e75adbf48c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'vehicles/index.html': {size: 27264, hash: 'ccc3c7316a89c8b09c72fd3644c1a430c441ff587da2fe1fb139cf883b05382e', text: () => import('./assets-chunks/vehicles_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 27264, hash: 'ccc3c7316a89c8b09c72fd3644c1a430c441ff587da2fe1fb139cf883b05382e', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 27264, hash: 'ccc3c7316a89c8b09c72fd3644c1a430c441ff587da2fe1fb139cf883b05382e', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'payments/index.html': {size: 27264, hash: 'ccc3c7316a89c8b09c72fd3644c1a430c441ff587da2fe1fb139cf883b05382e', text: () => import('./assets-chunks/payments_index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
