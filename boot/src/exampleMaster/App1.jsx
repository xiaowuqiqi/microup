import React from 'react';
import wudi1 from './assets/wudi.png'
import wudi2 from './assets/wudi.jpg'
import wudi3 from './assets/wudi.jpeg'
import package1 from '../../package.json'
export default (props) => {
  console.log(package1)
  return (
  <div>
    <img src={wudi1} alt="" width={500}/>
    <img src={wudi2} alt="" width={500}/>
    <img src={wudi3} alt="" width={500}/>
    app1
  </div>
)};
