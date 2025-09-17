import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const colors = getColors();
      const dynamicStyles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: colors.bg,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          color: colors.text,
          marginTop: 16,
          marginBottom: 8,
        },
        message: {
          fontSize: 16,
          color: colors.subtext,
          textAlign: 'center',
          marginBottom: 24,
        },
        button: {
          backgroundColor: colors.accent,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        },
        buttonText: {
          color: colors.bg,
          fontSize: 16,
          fontWeight: '600',
        },
      });

      return (
        <View style={dynamicStyles.container}>
          <Ionicons name="warning" size={48} color={colors.danger} />
          <Text style={dynamicStyles.title}>Something went wrong</Text>
          <Text style={dynamicStyles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={dynamicStyles.button}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={dynamicStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
