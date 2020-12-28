import React, { PureComponent } from 'react';
import { Prompt, Link, withRouter } from '../mini-react-router-dom';

class PromptPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { confirm: true };
  }

  render() {
    const { confirm } = this.state;
    return (
      <div>
        <h2>Product Page</h2>
        <p>
          <span>离开本页面时显示弹窗:</span>
          <button
            style={{ margin: '0 8px' }}
            type="button"
            onClick={() => {
              this.setState({ confirm: !confirm });
            }}>
            {confirm ? '是' : '否'}
          </button>
          <span>点击按钮更改状态</span>
        </p>
        <p><Link to="/">go home</Link></p>
        <Prompt when={confirm} message="你确定要离开吗？" />
      </div>
    );
  }
}

export default withRouter(PromptPage);