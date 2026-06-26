import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'
import dts from 'rollup-plugin-dts'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const isProduction = process.env.NODE_ENV === 'production'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/eusate-sdk.esm.js',
        format: 'es',
        exports: 'named',
        sourcemap: false,
      },
      {
        file: 'dist/eusate-sdk.min.js',
        format: 'iife',
        name: 'Eusate',
        exports: 'named',
        sourcemap: false,
        extend: true,
        globals: {
          window: 'window',
        },
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __VERSION__: JSON.stringify(pkg.version),
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'production',
          ),
        },
      }),
      resolve(),
      commonjs(),
      typescript({
        declaration: true,
        declarationDir: 'dist/_types',
        declarationMap: false,
      }),
      ...(isProduction ? [terser()] : []),
    ],
  },
  {
    input: 'dist/_types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]
