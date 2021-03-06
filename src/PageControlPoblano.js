import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Platform, ViewPropTypes } from 'react-native';

const DOT_RADIUS = 6;
const DOT_MARGINE = 6;
const MIDDLE_EXTRA_HIGHT = 4;
const ANIMATION_DURATION = Platform.OS == 'ios' ? 50 : 0;

class PageControlPoblano extends Component {

  translateX = new Animated.Value(0);

  componentDidMount() {
    this.updatePageControl(0);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.progress !== this.props.progress) {
      this.updatePageControl();
    }
  };

  render(){
    const {
      style,
      numberOfPages,
      radius,
      margin,
      activeTransparency,
      activeTintColor,
      inactiveBorderColor,
      hidesForSinglePage,
    } = this.props;

    const pages = Array.from(Array(numberOfPages).keys());
    const halfPageControlWidth = (((numberOfPages - 1) * (radius * 2)) + ((numberOfPages - 1) * margin)) / 2

    return (
      <View style={[style, {left: halfPageControlWidth}]}>
        { 
          numberOfPages <= 1 && hidesForSinglePage ? (
            null
          ) : (
            <View>
              <Animated.View style={[{flexDirection: 'row', transform: [{translateX: this.translateX}]}]}>
                {
                  pages.map((index) => 
                    <View
                      key={index}
                      style={{
                        width: radius * 2,
                        height: radius * 2,
                        marginRight: margin,
                        borderRadius: radius,
                        opacity: activeTransparency,
                        backgroundColor: activeTintColor,
                      }}
                    />
                  )
                }
              </Animated.View>

              <View style={{
                top: -MIDDLE_EXTRA_HIGHT,
                left: -MIDDLE_EXTRA_HIGHT,
                width: (radius + MIDDLE_EXTRA_HIGHT) * 2,
                height: (radius + MIDDLE_EXTRA_HIGHT) * 2,
                borderRadius: radius + MIDDLE_EXTRA_HIGHT,
                borderWidth: 2,
                borderColor: inactiveBorderColor,
                position: 'absolute',
                opacity: 1,
              }}/>
            </View>
          )
        }
      </View>
    )
  };

  updatePageControl(duration = ANIMATION_DURATION) {
    const newTranslateX  = this.getDotViewTranslateX();
    this.animateDotViewTranslateX(newTranslateX, duration);
  };

  getDotViewTranslateX() {
    const { progress, numberOfPages, radius, margin } = this.props;
    const width = ((numberOfPages - 1) * (radius * 2)) + ((numberOfPages - 1) * margin);
      
    if (progress <= 0) {
      return 0;
    } else if (progress >= 1) {
      return -width;
    } else {
      return -width * progress;
    }
  };

  animateDotViewTranslateX(value, duration) {
    if (isNaN(value)) return
    
    Animated.timing(this.translateX, {
      toValue: value,
      duration: duration,
      useNativeDriver: true,      
    }).start();
  }
  
};

PageControlPoblano.propTypes = {
  style: ViewPropTypes.style,
  numberOfPages: PropTypes.number.isRequired,
  progress: PropTypes.number,
  radius: PropTypes.number,
  margin: PropTypes.number,
  activeTransparency: PropTypes.number,
  activeTintColor: PropTypes.string,
  inactiveBorderColor: PropTypes.string,
  hidesForSinglePage: PropTypes.bool,
};

PageControlPoblano.defaultProps = {
  numberOfPages: 0,
  progress: 0,
  radius: DOT_RADIUS,
  margin: DOT_MARGINE,
  activeTransparency: 1,
  activeTintColor: 'black',
  inactiveBorderColor: 'black',
  hidesForSinglePage: true
};

export default PageControlPoblano;