import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import terser from '@rollup/plugin-terser';
import cssnano from 'cssnano';
import commonjs from '@rollup/plugin-commonjs';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/scripts/blueprint.js',
  output: {
    name: 'BP3DJS',
    file: isProduction ? 'build/js/bp3djs.min.js' : 'build/js/bp3djs.js',
    format: 'iife',
    sourcemap: true,
  },
  treeshake: true,
  plugins: [
    !isProduction && serve({
      contentBase: 'build',
      port: 10001,
      open: false
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      include: [
        'node_modules/es6-enum/**',
        'node_modules/three/**',
        'node_modules/@calvinscofield/three-objloader/**',
        'node_modules/bezier-js/**',
        'node_modules/line-intersect/**',
      ]
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: ['node_modules/**', 'src/styles/**'],
      presets: [['@babel/preset-env', { targets: { browsers: ['> 1%', 'last 2 versions'] } }]]
    }),
    postcss({
      extensions: ['.css'],
      plugins: [cssnano()]
    }),
    replace({
      preventAssignment: true,
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    isProduction && terser()
  ].filter(Boolean)
};

//~ include: [
        //~ 'node_modules/jquery/**',
        //~ 'node_modules/es6-enum/**',
        //~ 'node_modules/three/**',
        //~ 'node_modules/three-gltf-loader/**',
      //~ ],
