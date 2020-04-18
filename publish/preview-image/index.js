import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import CreatePortal from './create-portal';
import { SW, Quad, getSignal, requestAnimationFrame, cancelAnimationFrame } from './utils';
import './index.less';

// 触发 change 的滑动距离限定
const LIMITDIST = 50;
// 滑动的速度
const SPEED = 10;

export default class PreviewImage extends PureComponent {
  static propTypes = {
    index: PropTypes.number,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    source: PropTypes.array,
    indicatorClass: PropTypes.string,
  }

  static defaultProps = {
    index: 0,
    visible: false,
    onClose: () => {},
    source: [],
    indicatorClass: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      indicator: props.index,
      firstRender: true,
    };
    this.subscription = getSignal(this.addListener);
    this.indicator = props.index;
    this.offsetX = -SW * props.index;
    this.wrapperRef = createRef(null);
  }

  componentDidMount() {
    this.unSubscription = this.subscription();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.index !== this.props.index) {
      this.setState({ indicator: nextProps.index });
      this.offsetX = -SW * nextProps.index;
      this.indicator = nextProps.index;
    }
    if (nextProps.visible && this.state.firstRender) {
      this.setState({ firstRender: false });
    }
  }

  componentDidUpdate() {
    this.unSubscription = this.subscription();
  }

  componentWillUnmount() {
    this.unSubscription && this.unSubscription();
    if (this.requestAnimationID) {
      cancelAnimationFrame(this.requestAnimationID);
      this.requestAnimationID = null;
    }
  }

  addListener = () => {
    if (!this.wrapperRef.current) return false;
    this.wrapperRef.current.addEventListener('touchstart', this.handleTouchStart, false);
    this.wrapperRef.current.addEventListener('touchmove', this.handleTouchMove, false);
    this.wrapperRef.current.addEventListener('touchend', this.handleTouchEnd, false);
    return () => {
      this.wrapperRef.current.removeEventListener('touchstart', this.handleTouchStart, false);
      this.wrapperRef.current.removeEventListener('touchmove', this.handleTouchMove, false);
      this.wrapperRef.current.removeEventListener('touchend', this.handleTouchEnd, false);
    };
  }

  executeAnimation = () => {
    this.start++;
    this.translateX = Quad(this.start, this.offsetX, this.offset, this.duration);

    if (this.start + 1 >= this.duration) this.translateX = this.pos;
    this.wrapperRef.current.style.transform = `translateX(${this.translateX}px)`;
    this.wrapperRef.current.style.webkitTransform = `translateX(${this.translateX}px)`;
    if (this.start < this.duration) {
      this.requestAnimationID = requestAnimationFrame(this.executeAnimation);
    } else {
      cancelAnimationFrame(this.requestAnimationID);
      this.requestAnimationID = null;
      this.offsetX = this.pos;
    }
  }

  slideTo = (index) => {
    this.setState({ indicator: index });
    this.pos = -index * SW;
    this.offset = this.pos - this.offsetX;
    this.duration = Math.abs(this.offset / SPEED);
    this.start = 0;
    this.executeAnimation();
  };

  handleTouchStart = (event) => {
    if (this.requestAnimationID) {
      cancelAnimationFrame(this.requestAnimationID);
      this.requestAnimationID = null;
      this.offsetX = this.translateX;
    }
    this.startX = event.touches[0].clientX;
    this.slideX = 0;
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    this.slideX = event.changedTouches[0].clientX - this.startX;

    this.wrapperRef.current.style.transform = `translateX(${this.offsetX + this.slideX}px)`;
    this.wrapperRef.current.style.webkitTransform = `translateX(${this.offsetX + this.slideX}px)`;
  };

  handleTouchEnd = () => {
    if (this.slideX === 0) return;
    this.offsetX += this.slideX;
    if (this.slideX > 0 && this.slideX >= LIMITDIST) {
      this.indicator--;
    } else if (this.slideX < 0 && -this.slideX >= LIMITDIST) {
      this.indicator++;
    }

    if (this.indicator < 0) {
      this.indicator = 0;
    } else if (this.indicator >= this.props.source.length) {
      this.indicator = this.props.source.length - 1;
    }
    this.slideTo(this.indicator);
  };

  render() {
    const { visible, onClose, source, indicatorClass, index } = this.props;
    const { indicator, firstRender } = this.state;
    if (!visible && firstRender) return null;
    return (
      <CreatePortal>
        <div
          className={`mt-preview-image${visible ? ' show' : ' hide'}`}
          onClick={() => onClose(indicator)}
        >
          <ul
            className="mt-preview-image-wrapper"
            ref={this.wrapperRef}
            style={{
              width: source.length * SW,
              transform: `translateX(-${SW * index}px)`,
              WebkitTransform: `translateX(-${SW * index}px)`,
            }}
          >
            {
              source.map((item, idx) =>
                <li className="mt-preview-image-wrapper-item" key={`mt-preview-image-${idx}`}>
                  <img
                    src={item}
                    alt="tupian"
                    className="mt-preview-image-wrapper-item-img"
                  />
                </li>
              )
            }
          </ul>
          <div
            className={`mt-preview-image-indicator${indicatorClass ? ` ${indicatorClass}` : ''}`}
          >
            {`${indicator + 1} / ${source.length}`}
          </div>
        </div>
      </CreatePortal>
    );
  }
}
