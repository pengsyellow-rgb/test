import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Volume2,
  Type,
  Contrast,
  Space,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react-native";

export default function AccessibilityApp() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [contrastMode, setContrastMode] = useState("normal");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 48));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  }, []);

  const toggleContrast = useCallback(() => {
    setContrastMode((prev) => {
      if (prev === "normal") return "high";
      if (prev === "high") return "dark";
      return "normal";
    });
  }, []);

  const increaseSpacing = useCallback(() => {
    setLetterSpacing((prev) => Math.min(prev + 1, 10));
    setLineHeight((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const decreaseSpacing = useCallback(() => {
    setLetterSpacing((prev) => Math.max(prev - 1, 0));
    setLineHeight((prev) => Math.max(prev - 0.2, 1));
  }, []);

  const resetSettings = useCallback(() => {
    setFontSize(16);
    setContrastMode("normal");
    setLetterSpacing(0);
    setLineHeight(1.5);
  }, []);

  const readAloud = useCallback(async () => {
    if (!text) return;

    // Note: Text-to-speech would be implemented here with expo-speech
    // For now, we'll show a message
    Alert.alert(
      "Text-to-Speech",
      "Text-to-speech feature would read your text aloud here. This requires the expo-speech package to be installed.",
      [{ text: "OK" }],
    );
  }, [text]);

  const getContrastColors = () => {
    switch (contrastMode) {
      case "high":
        return {
          bg: "#FFFFFF",
          text: "#000000",
          border: "#000000",
          button: "#000000",
          buttonText: "#FFFFFF",
          cardBg: "#FFFFFF",
        };
      case "dark":
        return {
          bg: "#1a1a1a",
          text: "#FFFFFF",
          border: "#444444",
          button: "#FFFFFF",
          buttonText: "#000000",
          cardBg: "#2a2a2a",
        };
      default:
        return {
          bg: "#f5f5f5",
          text: "#333333",
          border: "#cccccc",
          button: "#4a90e2",
          buttonText: "#FFFFFF",
          cardBg: "#FFFFFF",
        };
    }
  };

  const colors = getContrastColors();

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}
    >
      <StatusBar style={contrastMode === "dark" ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              fontFamily: "Inter_700Bold",
              color: colors.text,
              marginBottom: 8,
            }}
          >
            Accessibility Text Editor
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: colors.text,
              opacity: 0.8,
            }}
          >
            Customize your reading experience
          </Text>
        </View>

        {/* Font Size Controls */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Type size={20} color={colors.text} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                fontFamily: "Inter_600SemiBold",
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Font Size: {fontSize}px
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={decreaseFontSize}
              style={{
                flex: 1,
                backgroundColor: colors.button,
                padding: 14,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Minus size={20} color={colors.buttonText} />
              <Text
                style={{
                  color: colors.buttonText,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                }}
              >
                Smaller
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={increaseFontSize}
              style={{
                flex: 1,
                backgroundColor: colors.button,
                padding: 14,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Plus size={20} color={colors.buttonText} />
              <Text
                style={{
                  color: colors.buttonText,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                }}
              >
                Larger
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contrast Mode */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Contrast size={20} color={colors.text} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                fontFamily: "Inter_600SemiBold",
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Contrast: {contrastMode}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleContrast}
            style={{
              backgroundColor: colors.button,
              padding: 14,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.buttonText,
                fontWeight: "600",
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
              }}
            >
              Change Contrast
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacing Controls */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Space size={20} color={colors.text} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                fontFamily: "Inter_600SemiBold",
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Spacing: {letterSpacing}px
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={decreaseSpacing}
              style={{
                flex: 1,
                backgroundColor: colors.button,
                padding: 14,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Minus size={20} color={colors.buttonText} />
              <Text
                style={{
                  color: colors.buttonText,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                }}
              >
                Less
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={increaseSpacing}
              style={{
                flex: 1,
                backgroundColor: colors.button,
                padding: 14,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Plus size={20} color={colors.buttonText} />
              <Text
                style={{
                  color: colors.buttonText,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                }}
              >
                More
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={readAloud}
            disabled={!text}
            style={{
              flex: 1,
              backgroundColor: colors.button,
              padding: 16,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: !text ? 0.5 : 1,
              borderWidth: isSpeaking ? 3 : 0,
              borderColor: colors.text,
            }}
          >
            <Volume2 size={24} color={colors.buttonText} />
            <Text
              style={{
                color: colors.buttonText,
                fontWeight: "600",
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
              }}
            >
              {isSpeaking ? "Stop" : "Read"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={resetSettings}
            style={{
              backgroundColor: colors.button,
              padding: 16,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <RotateCcw size={24} color={colors.buttonText} />
          </TouchableOpacity>
        </View>

        {/* Text Editor */}
        <View
          style={{
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Paste or type your text here..."
            placeholderTextColor={colors.text + "80"}
            multiline
            style={{
              backgroundColor: colors.cardBg,
              color: colors.text,
              padding: 16,
              fontSize: fontSize,
              letterSpacing: letterSpacing,
              lineHeight: fontSize * lineHeight,
              minHeight: 300,
              textAlignVertical: "top",
              fontFamily: "Inter_400Regular",
            }}
          />
        </View>

        {/* Character Count */}
        <Text
          style={{
            color: colors.text,
            opacity: 0.7,
            textAlign: "right",
            marginBottom: 16,
            fontFamily: "Inter_400Regular",
          }}
        >
          {text.length} characters
        </Text>

        {/* Instructions */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: "Inter_700Bold",
              color: colors.text,
              marginBottom: 12,
            }}
          >
            How to Use
          </Text>
          <Text
            style={{
              color: colors.text,
              opacity: 0.9,
              lineHeight: 24,
              fontFamily: "Inter_400Regular",
            }}
          >
            • Paste or type your text in the editor above{"\n"}• Adjust font
            size to make text larger or smaller{"\n"}• Change contrast mode for
            better readability{"\n"}• Increase spacing between letters and lines
            {"\n"}• Tap "Read" to hear your text spoken{"\n"}• Use reset button
            to return to defaults
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
