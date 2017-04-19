/**
 * Image Preview component for React Native
 * https://github.com/GaborWnuk
 * @flow
 */

import React, { PureComponent } from 'react';
import { Image, Platform, Animated, findNodeHandle } from 'react-native';
import { ImageCache } from 'react-native-img-cache';
import { BlurView } from 'react-native-blur';
import B64ImagePreview from './b64';

export default class ImagePreview extends PureComponent {
  static prefix = Platform.OS === 'ios' ? '' : 'file://';
  state = {
    viewRef: 0,
    path: undefined,
    previewOpacity: 0,
    opacity: new Animated.Value(0),
  };

  constructor() {
    super();
    this.handler = (path: string) => {
      this.setState({
        path: path,
      });

      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 300,
      }).start();
    };
  }

  dispose() {
    if (this.uri) {
      ImageCache.getCache().dispose(this.uri, this.handler);
    }
  }

  observe(uri: string, mutable: boolean) {
    if (uri !== this.uri) {
      this.dispose();
      this.uri = uri;
      ImageCache.getCache().on(uri, this.handler, !mutable);
    }
  }

  componentWillMount() {
    const { mutable } = this.props;
    const source = this.props.source;
    this.observe(source.uri, mutable === true);
  }

  componentWillReceiveProps(nextProps: { [id: string]: number }) {
    const { mutable } = nextProps;
    const source = this.props.source;
    this.observe(source.uri, mutable === true);
  }

  componentDidMount() {
    this.setState({
      viewRef: findNodeHandle(this.refs.backgroundImage),
      previewOpacity: 1,
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  render(): JSX.JSXElement {
    const { style } = this.props;
    var source: string = ImagePreview.prefix + this.state.path;
    var b64: string = 'data:image/jpeg;base64,' +
      new B64ImagePreview(this.props.b64).b64String;

    return (
      <Image
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            resizeMode: 'cover',
            opacity: this.state.previewOpacity,
          },
          this.state.path ? {} : { backgroundColor: 'transparent' },
          style,
        ]}
        source={{ uri: b64 }}
        ref={'backgroundImage'}
      >
        <BlurView
          viewRef={this.state.viewRef}
          blurType="light"
          blurAmount={7}
          overlayColor={'rgba(0, 0, 0, 0.1)'}
          style={{
            flex: 1,
          }}
        />
        <Animated.Image
          source={{ uri: source }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            opacity: this.state.opacity,
          }}
        />
        {this.props.children}
      </Image>
    );
  }
}
