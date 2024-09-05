mkdir ./dist/esm
cat >dist/esm/index.js <<!EOF
import cjsModule from '../index.js';
export const LruCache = cjsModule.LruCache;
!EOF

cat >dist/esm/package.json <<!EOF
{
  "type": "module"
}
!EOF
