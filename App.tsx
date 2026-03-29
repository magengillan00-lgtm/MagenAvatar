import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Avatar from './src/components/Avatar';
import ChatInterface from './src/components/ChatInterface';
import { UserProvider, useUser } from './src/context/AppContext';
import { sendMessage, initializeChat, getGreeting } from './src/services/geminiService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MainApp: React.FC = () => {
  const { userName, isFirstLaunch, completeFirstLaunch } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    initializeChat(userName);
    const welcomeText = `${getGreeting()} ${userName}! 👋✨\n\nأنا زيد، صديقك الرقمي! سعيد جداً بالتحدث معك. كيف يمكنني مساعدتك اليوم؟`;
    const welcomeMessage: Message = {
      id: '1',
      text: welcomeText,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message
    speak(welcomeText);

    if (isFirstLaunch) {
      completeFirstLaunch();
    }
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const keyboardWillShow = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const keyboardWillHide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const speak = (text: string) => {
    const cleanText = text.replace(/[*_#]/g, ''); // Clean markdown
    Speech.speak(cleanText, {
      language: 'ar',
      pitch: 1.1,
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsTyping(true);

    try {
      const response = await sendMessage(text);
      setIsTyping(false);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      speak(response);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      setIsTyping(false);
      setIsSpeaking(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى! 🙏',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Magen Avatar</Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isSpeaking ? '#22c55e' : '#94a3b8' }]} />
            <Text style={styles.statusText}>{isSpeaking ? 'يتحدث الآن...' : 'متصل'}</Text>
          </View>
        </View>

        <View style={[styles.avatarSection, keyboardVisible && styles.avatarSectionSmall]}>
          <Avatar isSpeaking={isSpeaking} isThinking={isTyping} />
        </View>

        <View style={styles.chatSection}>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  gradient: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 10 : 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
  statusIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#94a3b8' },
  avatarSection: { height: SCREEN_HEIGHT * 0.4, justifyContent: 'center', alignItems: 'center' },
  avatarSectionSmall: { height: SCREEN_HEIGHT * 0.25 },
  chatSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
});
