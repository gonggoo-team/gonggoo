/**
 * ChatInput Component
 *
 * 채팅 메시지 입력창입니다.
 * - 확장 아이콘 (chat_ext): 이미지/파일 첨부
 * - TextInput: 메시지 입력
 * - 전송 아이콘 (chat_send): 메시지 전송 (텍스트 있을 때만 활성화)
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useTheme, Icon } from '@/design-system';
import { createStyles } from './ChatInput.styles';
import type { ChatInputProps } from './ChatInput.types';

export default function ChatInput({ onSend, onAttach, disabled = false }: ChatInputProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(20);

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
      <View style={[styles.inputContainer, { maxHeight: Math.max(44, Math.min(inputHeight + 24, 120)) }
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
