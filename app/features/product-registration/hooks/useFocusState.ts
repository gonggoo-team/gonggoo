/**
 * useFocusState Hook
 *
 * Manages focus state for TextInput fields in product registration.
 * Returns focus handlers and dynamic border color based on focus state.
 *
 * Focus state applies brand primary color (#006242) to input borders.
 *
 * @example
 * const { focusHandlers, focusBorderColor } = useFocusState();
 *
 * <View style={[styles.inputContainer, { borderColor: focusBorderColor }]}>
 *   <TextInput {...focusHandlers} />
 * </View>
 */

import { useState } from 'react';
import { useTheme } from '@/design-system';

export const useFocusState = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const focusHandlers = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  const focusBorderColor = isFocused
    ? theme.colors.surface.brand.primary // #006242
    : theme.colors.border.midEmp; // #CACACA

  return { isFocused, focusHandlers, focusBorderColor };
};
