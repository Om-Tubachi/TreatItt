import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { colors } from '../../constants/theme';

interface Props {
    children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Define your sheet boundaries relative to the screen height
const MAX_UP_POSITION = -SCREEN_HEIGHT * 0.2; // How close to the top it goes
const MIN_DOWN_POSITION = 0;                  // Baseline resting position

export const DetailSheet: React.FC<Props> = ({ children }) => {
    const translationY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translationY.value };
        })
        .onUpdate((event) => {
            // Calculate new position
            let nextY = event.translationY + context.value.y;

            // Add slight resistance if dragging past maximum top boundary
            if (nextY < MAX_UP_POSITION) {
                nextY = MAX_UP_POSITION + (nextY - MAX_UP_POSITION) * 0.3;
            }

            translationY.value = nextY;
        })
        .onEnd((event) => {
            // Snap up or down based on swipe velocity and position thresholds
            if (event.velocityY < -500 || translationY.value < MAX_UP_POSITION / 2) {
                translationY.value = withSpring(MAX_UP_POSITION, { damping: 50 });
            } else {
                translationY.value = withSpring(MIN_DOWN_POSITION, { damping: 50 });
            }
        });

    const animatedSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translationY.value }],
    }));

    return (
        <GestureHandlerRootView style={styles.root}>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.sheet, animatedSheetStyle]}>
                    {/* Drag Handle Container */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    {/* Content Area */}
                    <Animated.ScrollView
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {children}
                    </Animated.ScrollView>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    sheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flex: 1,
        // Allows the sheet to expand underneath the screen view safely when dragged up
        height: SCREEN_HEIGHT,
    },
    handleContainer: {
        paddingVertical: 12,
        alignItems: 'center',
        width: '100%',
    },
    handle: {
        width: 40,
        height: 8,
        borderRadius: 2,
        backgroundColor: colors.inputBorder,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: SCREEN_HEIGHT * 0.3, // Give space for internal scrolling
        gap: 20,
    },
});