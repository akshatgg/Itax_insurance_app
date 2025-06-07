"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  TouchableOpacity,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

type InputProps = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  label?: string
  error?: string
  secureTextEntry?: boolean
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
  multiline?: boolean
  numberOfLines?: number
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
}) => {
  const { theme } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={error ? theme.colors.error : theme.colors.gray[500]}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray[400]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.m,
            },
            leftIcon && { paddingLeft: 40 },
            (rightIcon || secureTextEntry) && { paddingRight: 40 },
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
        />

        {secureTextEntry ? (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.rightIcon}>
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color={theme.colors.gray[500]} />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon as any} size={20} color={theme.colors.gray[500]} />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text style={[styles.error, { color: theme.colors.error, fontFamily: theme.typography.fontFamily.regular }]}>
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    position: "relative",
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftIcon: {
    position: "absolute",
    left: 12,
    top: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
})

export default Input
