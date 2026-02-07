/**
 * MessageBubble Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '@/design-system';
import type { MessageSender } from '@/app/shared/types';

export const createStyles = (theme: Theme, sender: MessageSender) => {
  const isMe = sender === 'me';

  return StyleSheet.create({
    bubble: {
      paddingVertical: 8,            
      paddingHorizontal: 12,
      maxWidth: '100%',
      
      backgroundColor: isMe ? theme.colors.surface.brand.primary : '#F5F5F5',
      alignSelf: isMe ? 'flex-end' : 'flex-start',    
      overflow: 'hidden',  
    },
    text: {
      fontSize: 14,
      fontWeight: '500',
      color: isMe ? theme.colors.surface.texticon.onnormal.text.white : theme.colors.surface.texticon.onnormal.text.black,
      lineHeight: 20,
      flexWrap: 'wrap', // 텍스트 줄바꿈     
      textAlign: 'left',       
    },
  });
};
