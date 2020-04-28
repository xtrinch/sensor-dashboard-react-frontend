import * as React from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

interface State {
  width: number;
  height: number;
}

interface Props {
  children: (state: State) => React.ReactNode;
  style: CSSProperties;
}

class ContainerWidthSizer extends React.Component<Props, State> {
  public state = {
    width: 0,
    height: 0,
  };

  private container: HTMLDivElement;

  componentDidMount() {
    this.setState({
      width: this.container.getBoundingClientRect().width,
      height: this.container.getBoundingClientRect().height,
    });
  }

  render() {
    return (
      <div style={this.props.style} ref={(c) => (this.container = c)}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

export default ContainerWidthSizer;
