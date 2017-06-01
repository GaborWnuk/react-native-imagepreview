/**
 * Image Preview component for React Native
 * https://github.com/GaborWnuk
 * @flow
 */

import React, { PureComponent } from 'react';
import { Image, Platform, Animated, findNodeHandle, Text } from 'react-native';
import { ImageCache } from 'react-native-img-cache';
import { BlurView } from 'react-native-blur';
import * as Progress from 'react-native-progress';
import B64ImagePreview from './b64';

export default class ImagePreview extends PureComponent {
  static prefix = Platform.OS === 'ios' ? '' : 'file://';
  state = {
    blurViewRef: 0,
    backgroundImageViewRef: 0,
    path: undefined,
    previewOpacity: 0,
    opacity: new Animated.Value(0),
  };

  constructor() {
    super();
    this.handler = path => {
      if (this.props.autoHeight) {
        Image.getSize(
          path,
          (width, height) => {
            this.setState({
              autoHeight: this.state.layout.width * height / width,
              path: ImagePreview.prefix + path,
            });
          },
          error => {
            console.warn(`Couldn't get the image size: ${error.message}`);
          },
        );
      } else {
        this.setState({
          path: ImagePreview.prefix + path,
        });
      }

      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 300,
      }).start();
    };

    this._onLayout = this._onLayout.bind(this);
  }

  dispose() {
    if (this.uri) {
      ImageCache.get().dispose(this.uri, this.handler);
    }
  }

  observe(source, mutable) {
    if (source.uri !== this.uri) {
      this.dispose();
      this.uri = source.uri;
      ImageCache.get().on(source, this.handler, !mutable);
    }
  }

  _onLayout(event) {
    if (!this.props.autoHeight) {
      return;
    }

    this.setState({ layout: event.nativeEvent.layout });
  }

  getProps() {
    const props = {};

    Object.keys(this.props).forEach(prop => {
      if (prop === 'source' && this.props.source.uri) {
        props['source'] = this.state.path
          ? { uri: FILE_PREFIX + this.state.path }
          : {};
      } else if (['mutable', 'component'].indexOf(prop) === -1) {
        props[prop] = this.props[prop];
      }
    });

    return props;
  }

  checkSource(source) {
    if (Array.isArray(source)) {
      throw new Error(
        `Giving multiple URIs to CachedImage is not yet supported.
            If you want to see this feature supported, please file and issue at
             https://github.com/wcandillon/react-native-img-cache`,
      );
    }
    return source;
  }
  componentWillMount() {
    const { mutable } = this.props;
    const source = this.checkSource(this.props.source);
    if (source.uri) {
      this.observe(source, mutable === true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mutable } = nextProps;
    const source = this.checkSource(nextProps.source);
    if (source.uri) {
      this.observe(source, mutable === true);
    }
  }

  componentDidMount() {
    this.setState({
      backgroundImageViewRef: this.state.backgroundImageViewRef,
      previewOpacity: 1,
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  render(): JSX.JSXElement {
    const { style } = this.props;
    var b64: string =
      'data:image/jpeg;base64,' + new B64ImagePreview(this.props.b64).b64String;

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
          !this.props.autoHeight || !this.state.autoHeight
            ? {}
            : { height: this.state.autoHeight },
        ]}
        onLayout={this._onLayout}
        source={{ uri: b64 }}
        ref={this.state.backgroundImageViewRef}
      >
        {this.props.blur &&
          !this.state.path &&
          <BlurView
            viewRef={this.state.blurViewRef}
            blurType="light"
            blurAmount={7}
            overlayColor={'rgba(0, 0, 0, 0.1)'}
            style={{
              flex: 1,
            }}
          />}
        {!this.state.path &&
          <Progress.Circle
            size={22}
            indeterminate={true}
            color="white"
            borderWidth={3}
            style={{
              position: 'absolute',
              bottom: 3,
              right: 3,
            }}
          />}
        <Animated.Image
          source={{ uri: this.state.path }}
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
