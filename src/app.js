import React, { PureComponent } from 'react';
import img1 from './static/images/11.jpg';
import img2 from './static/images/12.jpg';
import img3 from './static/images/13.jpg';
import img4 from './static/images/14.jpg';
import img5 from './static/images/15.jpg';
import img6 from './static/images/16.png';
import img7 from './static/images/17.png';
import PreviewImage from './preview-image';
import './app.css';

const source = [img1, img2, img3, img4, img5, img6, img7];
export default class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
      index: 0,
    };
  }

  handleTriggle = (idx) => this.setState(prevState => ({ visible: !prevState.visible, index: idx }));

  handleClose = (index) => {
    this.setState({ visible: false, index })
  }

  render() {
    const { visible, index } = this.state;
    return (
      <div className="container">
        <p>请切换到移动模式,并刷新后在查看</p>
        <div className="button" onClick={() => this.handleTriggle(index)}>点击查看</div>
        <div className="button" onClick={() => this.handleTriggle(3)}>点击查看</div>
        <div className="button" onClick={() => this.handleTriggle(4)}>点击查看</div>
        <PreviewImage
          source={source}
          index={index}
          visible={visible}
          indicatorClass="indicator"
          onClose={this.handleClose}
        />
      </div>
    );
  }
}