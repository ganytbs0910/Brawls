import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface UpdateNotificationProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({ 
  visible, 
  onClose,
  message 
}) => {
  if (!visible) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  message: {
    color: '#856404',
    flex: 1,
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
    marginLeft: 10
  },
  closeButtonText: {
    color: '#856404',
    fontSize: 20,
    fontWeight: 'bold'
  }
});