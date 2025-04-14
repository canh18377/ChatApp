import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Roboto-Bold',
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginVertical: 12,
    borderRadius: 8,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
