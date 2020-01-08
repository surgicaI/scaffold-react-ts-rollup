import * as React from 'react';
import { sum } from './test';
import './styles/index.scss';
import './styles/file.scss';
import { TestComponent } from './components/TestComponent';

export default function App(): JSX.Element {
    console.log(`${sum(1, 2)}`);
    return (
        <React.Fragment>
            <TestComponent />
            <h3 className="h1">Scaffold Rollup + TypeScript + React</h3>
        </React.Fragment>
    );
}
