import ReactDOM from 'react-dom';
import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function createPortal(props) {
  const [root] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(root);
    return () => {
      document.body.removeChild(root);
    };
  }, []);

  return ReactDOM.createPortal(props.children, root);
}

createPortal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(createPortal);
