import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import { eslint } from 'rollup-plugin-eslint';
import fs from 'fs';
import postcss from 'postcss';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import sass from 'rollup-plugin-sass';
import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json';
const extensions = ['.js', '.ts', '.tsx', '.jsx'];

const sassOptions = {
    output(styles, styleNodes) {
        fs.mkdirSync('public/css', { recursive: true }, err => {
            if (err) {
                throw err;
            }
        });

        styleNodes.forEach(({ id, content }) => {
            const scssName = id.substring(id.lastIndexOf('/') + 1, id.length);
            const name = scssName.split('.')[0];
            fs.writeFileSync(`public/css/${name}.css`, content);
        });
    },
    processor: _ =>
        postcss([
            autoprefixer({
                grid: false,
            }),
        ]),
};

const plugins = [
    resolve({
        extensions,
    }),
    commonjs(),
    eslint(),
    babel({
        exclude: 'node_modules/**',
    }),
    css({ output: false }),
    babel({
        extensions,
        exclude: /node_modules/,
        babelrc: false,
        runtimeHelpers: true,
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
];

if (!process.env.DEVELOPMENT) {
    plugins.push(
        sass({
            output: false,
        }),
    );
}

// If we are running with --environment DEVELOPMENT, serve via browsersync for local development
plugins.push(filesize());

const rollupBuilds = [
    // Generate unminifed bundle
    {
        input: './src/index.tsx',
        output: [
            {
                file: pkg.main,
                format: 'es',
                name: 'admin_index',
                sourcemap: true,
            },
        ],
        plugins,
    },
];

if (!process.env.DEVELOPMENT) {
    rollupBuilds.push(
        // Generate minifed bundle
        {
            input: './src/index.tsx',
            output: {
                file: 'dist/bundle.min.js',
                format: 'es',
                name: 'Shepherd',
                sourcemap: true,
            },
            plugins: [
                resolve(),
                commonjs(),
                babel({
                    exclude: 'node_modules/**',
                }),
                sass(sassOptions),
                css({ output: false }),
                uglify(),
                filesize(),
            ],
        },
    );
}

export default rollupBuilds;
