
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
    'index.csr.html': {size: 23562, hash: '21264eb82d12c323927f867e5707aa8775b39a0c3bb1dae90cd83bcde7dfe41d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17136, hash: 'd9f4cbab337baf14100e7240919d28b17c5cdc3503a7b1a116d53803fcd7686e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 27264, hash: '7da68b9b3394dc534decc927cb631b7074c4211d9751398859763e0cb08cc118', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 27264, hash: '7da68b9b3394dc534decc927cb631b7074c4211d9751398859763e0cb08cc118', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'vehicles/index.html': {size: 27264, hash: '7da68b9b3394dc534decc927cb631b7074c4211d9751398859763e0cb08cc118', text: () => import('./assets-chunks/vehicles_index_html.mjs').then(m => m.default)},
    'payments/index.html': {size: 27264, hash: '7da68b9b3394dc534decc927cb631b7074c4211d9751398859763e0cb08cc118', text: () => import('./assets-chunks/payments_index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
