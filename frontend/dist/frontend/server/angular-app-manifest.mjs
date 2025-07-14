
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
    'index.csr.html': {size: 23562, hash: 'd6062a01a4b8e0a8c35aa7c1941c97aeb547799afa1222725a853a60327199fa', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17136, hash: '5ddec92fcee989b6422c23dffbfe0ce2f3c3f48fd1f9328f694f40047c9d3388', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 27264, hash: '07a5a8acacabbe1198eff95abb4e3e390110b38b1eff10facb90a5a2776c7017', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 27264, hash: '07a5a8acacabbe1198eff95abb4e3e390110b38b1eff10facb90a5a2776c7017', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'payments/index.html': {size: 27264, hash: '07a5a8acacabbe1198eff95abb4e3e390110b38b1eff10facb90a5a2776c7017', text: () => import('./assets-chunks/payments_index_html.mjs').then(m => m.default)},
    'vehicles/index.html': {size: 27264, hash: '07a5a8acacabbe1198eff95abb4e3e390110b38b1eff10facb90a5a2776c7017', text: () => import('./assets-chunks/vehicles_index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
