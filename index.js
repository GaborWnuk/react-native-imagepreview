/**
 * Image Preview component for React Native
 * https://github.com/GaborWnuk
 * @flow
 */

import React, { PureComponent } from 'react';
import { Image, Platform, Animated } from 'react-native';
import { ImageCache } from 'react-native-img-cache';
import { BlurView } from 'react-native-blur';
import B64ImagePreview from './b64';

export default class ImagePreview extends PureComponent {
  static prefix = Platform.OS === 'ios' ? '' : 'file://';
  state = {
    path: undefined,
    blurRadius: new Animated.Value(10),
  };

  constructor() {
    super();
    this.handler = path => {
      setTimeout(
        () => {
          this.setState({ path });
          Animated.timing(this.state.blurRadius, {
            toValue: 0,
            duration: 300,
          }).start();
        },
        5000,
      );
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

  render() {
    const { style, b64 } = this.props;
    var source: string = ImagePreview.prefix + this.state.path;

    if (!this.state.path && b64) {
      const imagePreview = new B64ImagePreview(b64);
      source = 'data:image/jpeg;base64,' + imagePreview.b64String;
    }

    return (
      <Image style={style} source={{ uri: source }}>
        <BlurView
          blurType="light"
          blurAmount={this.state.blurRadius}
          style={{ flex: 1 }}
        >
          {this.props.children}
        </BlurView>
      </Image>
    );
  }
}
