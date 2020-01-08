import replace from '@rollup/plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import sass from 'node-sass';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import { uglify } from 'rollup-plugin-uglify';

/** This is done to resolve the following error while building react with rollup
    createElement is not exported by node_modules/react/index.js
**/
import * as react from 'react';
import * as reactDom from 'react-dom';
import * as reactIs from 'react-is';
import * as propTypes from 'prop-types';

const isProd = process.env.NODE_ENV === 'production';
const extensions = ['.js', '.ts', '.tsx'];

export default {
    input: 'src/index.tsx',
    output: {
        file: 'public/index.js',
        format: 'es',
        sourcemap: isProd ? false : true,
    },
    experimentalCodeSplitting: true,
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        }),
        resolve({
            extensions,
        }),
        postcss({
            preprocessor: (content, id) =>
                new Promise((resolve, _) => {
                    const result = sass.renderSync({ file: id });
                    resolve({ code: result.css.toString() });
                }),
            plugins: [autoprefixer({ grid: false })],
            sourceMap: isProd ? false : true,
            extract: 'public/styles/index.css',
            autoModules: true,
            extensions: ['.scss', '.sass', '.css'],
        }),
        commonjs({
            include: /node_modules/,
            sourceMap: isProd ? false : true,
            /** named exports added resolve the following error while building react with rollup
                createElement is not exported by node_modules/react/index.js
            **/
            namedExports: {
                react: Object.keys(react),
                'react-dom': Object.keys(reactDom),
                'react-is': Object.keys(reactIs),
                'prop-types': Object.keys(propTypes),
            },
        }),
        eslint(),
        babel({
            extensions,
            exclude: /node_modules/,
            babelrc: false,
            runtimeHelpers: true,
            sourceMaps: isProd ? false : true,
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: [
                'react-require',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                [
                    '@babel/plugin-proposal-object-rest-spread',
                    {
                        useBuiltIns: true,
                    },
                ],
                [
                    '@babel/plugin-transform-runtime',
                    {
                        corejs: 2,
                        helpers: true,
                        regenerator: true,
                        useESModules: false,
                    },
                ],
            ],
        }),
        isProd && uglify(),
        isProd && terser(),
    ],
};
