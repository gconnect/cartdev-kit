import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ConnectWalletButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Connect Wallet</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'cyan',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ConnectWalletButton;
