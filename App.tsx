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
import Avatar from './src/components/Avatar';
import ChatInterface from './src/components/ChatInterface';
import { UserProvider, useUser } from './src/context/AppContext';
import { sendMessage, initializeChat, getGreeting } from './src/services/geminiService';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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
    // Initialize chat with user name
    initializeChat(userName);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: `${getGreeting()} ${userName}! 👋✨\n\nأنا زيد، صديقك الرقمي! سعيد جداً بالتحدث معك. كيف يمكنني مساعدتك اليوم؟`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Mark first launch as complete
    if (isFirstLaunch) {
      completeFirstLaunch();
    }
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get AI response
      const response = await sendMessage(text);

      // Simulate speaking animation
      setIsTyping(false);
      setIsSpeaking(true);

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      // Simulate speaking duration based on message length
      const speakingDuration = Math.min(response.length * 30, 3000);
      
      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 500);

      setTimeout(() => {
        setIsSpeaking(false);
      }, speakingDuration);
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
        colors={['#1a1a2e', '#16213e', '#0f0f23']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background particles */}
        <View style={styles.backgroundOverlay}>
          <View style={[styles.particle, styles.particle1]} />
          <View style={[styles.particle, styles.particle2]} />
          <View style={[styles.particle, styles.particle3]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Magen Avatar</Text>
          <Text style={styles.headerSubtitle}>تحدث مع زيد ✨</Text>
        </View>

        {/* Avatar Section */}
        <View style={[styles.avatarSection, keyboardVisible && styles.avatarSectionSmall]}>
          <Avatar isSpeaking={isSpeaking} isThinking={isTyping} />
        </View>

        {/* Chat Section */}
        <View style={styles.chatSection}>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </View>

        {/* User name badge */}
        <View style={styles.userBadge}>
          <Text style={styles.userBadgeText}>👤 {userName}</Text>
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
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  particle1: {
    top: '10%',
    left: '10%',
  },
  particle2: {
    top: '50%',
    right: '5%',
    width: 150,
    height: 150,
  },
  particle3: {
    bottom: '20%',
    left: '5%',
    width: 80,
    height: 80,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  avatarSection: {
    height: SCREEN_HEIGHT * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSectionSmall: {
    height: SCREEN_HEIGHT * 0.2,
  },
  chatSection: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  userBadge: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 50 : 60,
    right: 15,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  userBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
