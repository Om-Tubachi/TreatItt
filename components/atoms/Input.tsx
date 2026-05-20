import React, { useState } from 'react';
import {
  StyleSheet, TextInput, TextInputProps,
  TouchableOpacity, View,
} from 'react-native';
import EyeIcon from '../../components/assets/icons/EyeIcon.svg';
import { colors, fontSize, layout, radius, typography } from '../../constants/theme';


interface Props extends TextInputProps {
  secureToggle?: boolean;
}

export const Input: React.FC<Props> = ({ secureToggle = false, style, ...rest }) => {
  const [hidden, setHidden] = useState(secureToggle);

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={hidden}
        {...rest}
      />
      {secureToggle && (
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setHidden(p => !p)}>
       <EyeIcon open={!hidden} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  input: {
    width:             layout.buttonWidth,
    height:            52,
    borderRadius:      radius.md,
    borderWidth:       1,
    borderColor:       colors.inputBorder,
    backgroundColor:   colors.inputBg,
    paddingHorizontal: 16,
    paddingRight:      44,
    fontFamily:        typography.body,
    fontSize:          fontSize.md,
    color:             colors.black,
  },
  eyeBtn: {
    position:       'absolute',
    right:          14,
    top:            0,
    bottom:         0,
    justifyContent: 'center',
  },
});