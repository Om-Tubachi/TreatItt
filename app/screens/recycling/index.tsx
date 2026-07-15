import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecyclingCard } from '../../../components/organisms/RecyclingCard';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useAllRecyclerProcesses } from '../../../hooks/useRecyclerProcesses'; // Adjust this hook import path based on your layout

export default function RecyclingIndexScreen() {
    const router = useRouter();
    
    // Fetch all global recycling processes in the application
    const { data: processes, isLoading, isError } = useAllRecyclerProcesses();

    return (
        <View style={styles.screen}>
            {/* Action Bar Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Recycling Services</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Content States Container */}
            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary || '#74C044'} />
                </View>
            ) : isError ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Failed to load recycling services.</Text>
                </View>
            ) : (
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                >
                    {processes && processes.length > 0 ? (
                        processes.map((process: any) => (
                            <RecyclingCard 
                                key={process.id} 
                                item={process} 
                                onPress={() => router.push(`/screens/recycling/${process.id}` as any)} 
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recycling services are currently available.</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { 
        flex: 1, 
        backgroundColor: appBg 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: layout.screenPadH, 
        paddingTop: 56, 
        paddingBottom: 16 
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    back: { 
        fontSize: 32, 
        color: colors.black, 
        fontWeight: '300' 
    },
    title: { 
        flex: 1, 
        textAlign: 'center', 
        fontFamily: typography.heading, 
        fontSize: fontSize.xl, 
        color: colors.black 
    },
    scrollContainer: {
        paddingHorizontal: layout.screenPadH,
        paddingBottom: 40,
        gap: 12, // Standard layout card grouping gap
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: layout.screenPadH,
    },
    errorText: {
        fontFamily: typography.bodyMed,
        fontSize: fontSize.sm,
        color: '#D9383A',
        textAlign: 'center',
    },
    emptyContainer: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: typography.body,
        fontSize: fontSize.sm,
        color: colors.body,
        textAlign: 'center',
    },
});