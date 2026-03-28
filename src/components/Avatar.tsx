import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Ellipse, Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = width * 0.65;

interface AvatarProps {
  isSpeaking: boolean;
  isThinking: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ isSpeaking, isThinking }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;

  // Floating animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Speaking animation
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(mouthAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(mouthAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      mouthAnim.setValue(0);
    }
  }, [isSpeaking]);

  // Thinking pulse animation
  useEffect(() => {
    if (isThinking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isThinking]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.glowContainer}>
        <Svg width={AVATAR_SIZE + 40} height={AVATAR_SIZE + 40} viewBox="0 0 300 300">
          <Defs>
            <LinearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
          <Circle cx="150" cy="150" r="140" fill="url(#glowGradient)" />
        </Svg>
      </View>

      <Animated.View
        style={[
          styles.avatarWrapper,
          {
            transform: [
              { translateY: floatY },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <Svg width={AVATAR_SIZE} height={AVATAR_SIZE} viewBox="0 0 200 200">
          <Defs>
            {/* Hair gradient */}
            <LinearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#1a1a2e" />
              <Stop offset="100%" stopColor="#16213e" />
            </LinearGradient>
            {/* Skin gradient */}
            <LinearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#fce7d6" />
              <Stop offset="100%" stopColor="#f5d5c8" />
            </LinearGradient>
            {/* Eye gradient */}
            <LinearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#6366f1" />
              <Stop offset="50%" stopColor="#4f46e5" />
              <Stop offset="100%" stopColor="#3730a3" />
            </LinearGradient>
            {/* Shirt gradient */}
            <LinearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#6366f1" />
              <Stop offset="100%" stopColor="#4f46e5" />
            </LinearGradient>
          </Defs>

          {/* Hair back */}
          <Path
            d="M40 90 Q30 60 50 40 Q70 20 100 18 Q130 16 150 25 Q175 35 185 60 Q195 85 190 100 Q185 75 175 60 Q160 45 140 40 Q120 35 100 38 Q80 40 65 55 Q50 70 45 90 Z"
            fill="url(#hairGradient)"
          />

          {/* Neck */}
          <Rect x="85" y="145" width="30" height="25" rx="5" fill="url(#skinGradient)" />

          {/* Shirt/Collar */}
          <Path
            d="M60 165 Q70 155 85 160 L100 175 L115 160 Q130 155 140 165 L145 200 L55 200 Z"
            fill="url(#shirtGradient)"
          />
          {/* Collar detail */}
          <Path
            d="M85 160 L100 175 L115 160"
            fill="none"
            stroke="#4338ca"
            strokeWidth="2"
          />

          {/* Face */}
          <Ellipse cx="100" cy="95" rx="55" ry="60" fill="url(#skinGradient)" />

          {/* Hair front */}
          <Path
            d="M45 85 Q40 50 60 35 Q80 22 100 20 Q120 18 140 28 Q165 40 170 70 Q172 85 165 90 Q155 70 140 55 Q120 42 100 45 Q80 48 65 60 Q50 75 48 90 Q45 88 45 85 Z"
            fill="url(#hairGradient)"
          />

          {/* Hair strands */}
          <Path
            d="M55 70 Q45 55 55 40 Q65 50 60 65"
            fill="url(#hairGradient)"
          />
          <Path
            d="M145 70 Q155 55 145 40 Q135 50 140 65"
            fill="url(#hairGradient)"
          />

          {/* Eyebrows */}
          <Path
            d="M65 75 Q75 72 85 75"
            fill="none"
            stroke="#2d2d2d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Path
            d="M115 75 Q125 72 135 75"
            fill="none"
            stroke="#2d2d2d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <Animated.View style={{ opacity: blinkAnim }}>
            {/* Left eye */}
            <Ellipse cx="75" cy="90" rx="12" ry="14" fill="white" />
            <Circle cx="75" cy="90" r="8" fill="url(#eyeGradient)" />
            <Circle cx="75" cy="88" r="4" fill="black" />
            <Circle cx="72" cy="85" r="2" fill="white" />
            
            {/* Right eye */}
            <Ellipse cx="125" cy="90" rx="12" ry="14" fill="white" />
            <Circle cx="125" cy="90" r="8" fill="url(#eyeGradient)" />
            <Circle cx="125" cy="88" r="4" fill="black" />
            <Circle cx="122" cy="85" r="2" fill="white" />
          </Animated.View>

          {/* Nose */}
          <Path
            d="M100 95 Q102 105 100 110 Q98 108 100 105"
            fill="none"
            stroke="#e5c4b0"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Mouth */}
          <Animated.Path
            d={isSpeaking ? "M88 120 Q100 128 112 120" : "M88 118 Q100 125 112 118"}
            fill={isSpeaking ? "#ffb6b6" : "none"}
            stroke="#d4736a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Blush */}
          <Ellipse cx="60" cy="105" rx="10" ry="5" fill="#ffb6c1" opacity="0.4" />
          <Ellipse cx="140" cy="105" rx="10" ry="5" fill="#ffb6c1" opacity="0.4" />

          {/* Ears */}
          <Ellipse cx="45" cy="95" rx="8" ry="12" fill="url(#skinGradient)" />
          <Ellipse cx="155" cy="95" rx="8" ry="12" fill="url(#skinGradient)" />
        </Svg>
      </Animated.View>

      {/* Name tag */}
      <View style={styles.nameTag}>
        <Animated.Text style={[styles.nameText, { opacity: pulseAnim }]}>
          Zeed
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    opacity: 0.6,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameTag: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
    letterSpacing: 2,
  },
});

export default Avatar;
