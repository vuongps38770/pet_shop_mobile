import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { LAYOUT, SPACING } from "../../theme/layout";

interface FormInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  maxLength?: number;
}

export const FormInput = (props: FormInputProps) => {
  const {
    label,
    value,
    onChangeText,
    onBlur,
    error,
    touched,
    placeholder,
    secureTextEntry,
    keyboardType = "default",
    autoCapitalize = "none",
    multiline = false,
    numberOfLines = 1,
    leftIcon,
    rightIcon,
    maxLength,
  } = props ?? {};

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          error && touched && styles.inputError,
          multiline && { height: numberOfLines * 24 },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.M,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: SPACING.XS,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: SPACING.XS,
  },
  leftIcon: {
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  rightIcon: {
    marginLeft: 8,
  },
});
