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
    opacity: new Animated.Value(0),
  };

  constructor() {
    super();
    this.handler = path => {
      this.setState({
        path: path,
      });
    };
  }

  dispose() {
    if (this.uri) {
      ImageCache.getCache().dispose(this.uri, this.handler);
    }
  }

  observe(uri, mutable) {
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

  componentWillReceiveProps(nextProps) {
    const { mutable } = nextProps;
    const source = this.props.source;
    this.observe(source.uri, mutable === true);
  }

  componentWillUnmount() {
    this.dispose();
  }

  createBlur() {
    if (!this.state.viewRef) {
      Animated.timing(this.state.opacity, {
        toValue: 1.0,
        duration: 100,
      }).start();
      this.setState({
        viewRef: findNodeHandle(this.refs.backgroundImage),
      });
    }
  }

  render() {
    const { style, b64 } = this.props;
    var source: string = ImagePreview.prefix + this.state.path;

    if (!this.state.path && b64) {
      const imagePreview = new B64ImagePreview(b64);
      source = 'data:image/jpeg;base64,' + imagePreview.b64String;
    }

    return (
      <Animated.Image
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            resizeMode: 'cover',
            opacity: this.state.opacity,
          },
          this.state.path ? {} : { backgroundColor: 'transparent' },
          style,
        ]}
        source={{ uri: source }}
        ref={'backgroundImage'}
        onLoad={this.createBlur.bind(this)}
      >
        {!this.state.path &&
          <BlurView
            viewRef={this.state.viewRef}
            blurType="light"
            blurAmount={10}
            style={{
              flex: 1,
            }}
          />}
      </Animated.Image>
    );
  }
}
