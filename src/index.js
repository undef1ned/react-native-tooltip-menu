import React from 'react';
import PropTypes from 'prop-types';
import ReactNative from 'react-native';

import TooltipMenuItem from './TooltipMenuItem';

const {
  View,
  Modal,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} = ReactNative;

const window = Dimensions.get('window');

const mapWight = (type) => {
  switch (type) {
    case 'half':
      return {
        width: window.width / 2,
      };
    case 'full':
      return {
        width: window.width * 0.9,
      };

    default:
      return null;
  }
};

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      opacity: new Animated.Value(0),
      componentHeight: 0,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  toggleModal() {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  }

  openModal() {
    this.toggleModal();
    Animated
      .timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 300,
        },
      )
      .start();
  }

  hideModal() {
    Animated
      .timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: 300,
        },
      )
      .start(this.toggleModal);
  }

  handleClick(onClickItem) {
    const method = this.state.isModalOpen ? this.hideModal : this.openModal;
    method();

    onClickItem();
  }

  render() {
    const {
      buttonComponent,
      items,
      componentWrapperStyle,
      overlayStyle,
      widthType,
      labelContainerStyle,
      touchableItemStyle,
      labelStyle,
      selectedStyle,
      modalButtonStyle,
      width,
      height,
      title,
      titleStyle
    } = this.props;
    const { isModalOpen } = this.state;
    const { onRequestClose } = this.props;
    const widthStyle = mapWight(widthType);

    return (
      <View >
        <View
          style={[componentWrapperStyle]}
          onLayout={event => this.setState({ componentHeight: event.nativeEvent.layout.height })}
        >
          <TouchableOpacity onPress={this.openModal}>
            {buttonComponent}
          </TouchableOpacity>
        </View>
        <Modal
          visible={isModalOpen}
          transparent
          onRequestClose={onRequestClose}
        >
          <View style={[styles.overlay, overlayStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              focusedOpacity={1}
              style={[{ flex: 1 }, modalButtonStyle]}
              onPress={this.hideModal}
            >
              <View style={[styles.component, {
                  top: height - 46,
                  left: width - 111
              }]}>
                <Animated.View
                  style={[
                    styles.tooltipContainer,
                    {
                      bottom: this.state.componentHeight + 10,
                    },
                    { opacity: this.state.opacity },
                  ]}
                >
                {
                    title &&
                    <Text style={titleStyle}>{title}</Text>
                }

                  {items.map((item, index) => {
                    const classes = [labelContainerStyle];

                    if (index !== (items.length - 1)) {
                      classes.push(styles.tooltipMargin);
                    }

                    return (
                      <TooltipMenuItem
                        key={item.label}
                        label={item.label}
                        onPress={() => this.handleClick(item.onPress)}
                        selected={item.selected}
                        containerStyle={classes}
                        touchableStyle={touchableItemStyle}
                        selectedStyle={selectedStyle}
                        labelStyle={labelStyle}
                      />
                    );
                  })}
                </Animated.View>
                <Animated.View style={[styles.triangle, { opacity: this.state.opacity }]} />
                <TouchableOpacity onPress={isModalOpen ? this.hideModal : this.openModal}>
                  {buttonComponent}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

Tooltip.propTypes = {
  buttonComponent: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
      ]),
      onClick: PropTypes.func,
    }),
  ).isRequired,
  componentWrapperStyle: PropTypes.object,
  overlayStyle: PropTypes.object,
  labelContainerStyle: PropTypes.object,
  touchableItemStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  widthType: PropTypes.oneOf([
    'auto',
    'half',
    'full',
  ]),
  onRequestClose: PropTypes.func,
};

Tooltip.defaultProps = {
  widthType: 'half',
  onRequestClose: () => {},
};

export default Tooltip;

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  tooltipMargin: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  component: {
    position: 'absolute',
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
    left: -100,
    width: 200
  },
  triangle: {
    position: 'absolute',
    top: -10,
    left: 22,
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: 'white',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
