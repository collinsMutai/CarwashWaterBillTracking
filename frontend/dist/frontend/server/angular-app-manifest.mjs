
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
    'index.csr.html': {size: 23562, hash: 'b4830e3a09037b9d27e490b58fe99c840e4cf92c800404ad6ef225aabe809c04', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17136, hash: 'cdc3c0d92664022882ea84be79849b09f78a3ca477893cf41749f3590d96ad63', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 27264, hash: '414c7dd76deeeac01219e64dcd75420738f75dd94fd395bee392dc8c945f37fe', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 27264, hash: '414c7dd76deeeac01219e64dcd75420738f75dd94fd395bee392dc8c945f37fe', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'vehicles/index.html': {size: 27264, hash: '414c7dd76deeeac01219e64dcd75420738f75dd94fd395bee392dc8c945f37fe', text: () => import('./assets-chunks/vehicles_index_html.mjs').then(m => m.default)},
    'payments/index.html': {size: 27264, hash: '414c7dd76deeeac01219e64dcd75420738f75dd94fd395bee392dc8c945f37fe', text: () => import('./assets-chunks/payments_index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
