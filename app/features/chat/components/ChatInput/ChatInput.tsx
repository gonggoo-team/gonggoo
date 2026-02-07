/**
 * ChatInput Component
 *
 * 채팅 메시지 입력창입니다.
 * - 확장 아이콘 (chat_ext): 이미지/파일 첨부
 * - TextInput: 메시지 입력
 * - 전송 아이콘 (chat_send): 메시지 전송 (텍스트 있을 때만 활성화)
 * - 키보드 상태에 따라 하단 safe area 패딩 동적 적용
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Icon } from '@/design-system';
import { createStyles } from './ChatInput.styles';
import type { ChatInputProps } from './ChatInput.types';

export default function ChatInput({ onSend, onAttach, disabled = false }: ChatInputProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(20);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // 키보드 상태 감지 (카카오톡, 인스타그램처럼 자연스러운 동작)
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // 키보드가 올라오면 하단 safe area 불필요 (키보드가 해당 영역을 가림)
  const bottomInset = isKeyboardVisible ? 0 : insets.bottom;
  const styles = createStyles(theme, bottomInset);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setInputHeight(20);
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      {/* 입력창 */}
      <View style={[styles.inputContainer
      ]}>
        {/* 첨부 버튼 */}
        <TouchableOpacity style={styles.attachButton} onPress={onAttach} disabled={disabled}>
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* TextInput */}
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="메시지 입력"
          placeholderTextColor={theme.colors.surface.texticon.onnormal.text.midEmp}
          multiline
          editable={!disabled}
          blurOnSubmit={false}
          returnKeyType="default"
          textAlignVertical="center"
          onContentSizeChange={(event) => {
            setInputHeight(event.nativeEvent.contentSize.height);
          }}
        />

        {/* 전송 버튼 */}
        <TouchableOpacity
          style={[styles.sendButton, styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <Icon name="chat_send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
