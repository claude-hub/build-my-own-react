import React from '../mini-react/react';
import ClassComponent from './ClassComponent';
import FunctionComponent from './FunctionComponent';
import './index.css';

export default function funcComp() {
  return (
    <div className="padding-24">
      <h2>React实现</h2>
      <div>
        <FunctionComponent name="function" />
        <ClassComponent name="class" />
      </div>
    </div>
  );
}