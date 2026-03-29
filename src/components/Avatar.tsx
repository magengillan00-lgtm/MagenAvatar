import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Platform } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Ellipse, Path, Circle, Rect } from 'react-native-svg';
import Rive, { RiveRef, StateMachineInput } from 'rive-react-native';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = width * 0.75;

interface AvatarProps {
  isSpeaking: boolean;
  isThinking: boolean;
  audioLevel?: number; // Voice amplitude for Lip Sync
}

const Avatar: React.FC<AvatarProps> = ({ isSpeaking, isThinking, audioLevel = 0 }) => {
  const riveRef = useRef<RiveRef>(null);
  const [useRive, setUseRive] = useState(false); // Default to SVG for now until Rive asset is ready

  // SVG Animations (Fallback)
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Blinking animation
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Sync with Rive State Machine
  useEffect(() => {
    if (riveRef.current) {
      if (isSpeaking) {
        riveRef.current.setInputState('State Machine 1', 'isSpeaking', true);
      } else {
        riveRef.current.setInputState('State Machine 1', 'isSpeaking', false);
      }
      
      if (isThinking) {
        riveRef.current.setInputState('State Machine 1', 'isThinking', true);
      } else {
        riveRef.current.setInputState('State Machine 1', 'isThinking', false);
      }
    }
  }, [isSpeaking, isThinking]);

  // SVG Speaking animation
  useEffect(() => {
    if (isSpeaking && !useRive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(mouthAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
          Animated.timing(mouthAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        ])
      ).start();
    } else {
      mouthAnim.setValue(0);
    }
  }, [isSpeaking, useRive]);

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const renderSVGAvatar = () => (
    <Animated.View
      style={[
        styles.avatarWrapper,
        { transform: [{ translateY: floatY }, { scale: isThinking ? pulseAnim : 1 }] },
      ]}
    >
      <Svg width={AVATAR_SIZE} height={AVATAR_SIZE} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1a1a2e" />
            <Stop offset="100%" stopColor="#16213e" />
          </LinearGradient>
          <LinearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#fce7d6" />
            <Stop offset="100%" stopColor="#f5d5c8" />
          </LinearGradient>
          <LinearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#6366f1" />
            <Stop offset="100%" stopColor="#3730a3" />
          </LinearGradient>
        </Defs>

        {/* Neck */}
        <Rect x="85" y="145" width="30" height="25" rx="5" fill="url(#skinGradient)" />

        {/* Face */}
        <Ellipse cx="100" cy="95" rx="55" ry="60" fill="url(#skinGradient)" />

        {/* Eyes with Blinking */}
        <Animated.View style={{ opacity: blinkAnim }}>
          <Circle cx="75" cy="90" r="8" fill="url(#eyeGradient)" />
          <Circle cx="125" cy="90" r="8" fill="url(#eyeGradient)" />
          <Circle cx="75" cy="88" r="3" fill="white" />
          <Circle cx="125" cy="88" r="3" fill="white" />
        </Animated.View>

        {/* Dynamic Mouth (Lip Sync Simulation) */}
        <Animated.Path
          d={isSpeaking ? "M85 125 Q100 140 115 125" : "M88 120 Q100 125 112 120"}
          fill="none"
          stroke="#d4736a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {useRive ? (
        <Rive
          ref={riveRef}
          resourceName="magen_avatar" // Needs to be added to Android/iOS assets
          stateMachineName="State Machine 1"
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        />
      ) : (
        renderSVGAvatar()
      )}
      
      <View style={styles.nameTag}>
        <Animated.Text style={styles.nameText}>ZEED</Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  nameTag: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});

export default Avatar;
