import { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
    const [menuView, setMenuView] = useState('main');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>{'codeX'}</Text>
                <Text style={styles.subtitle}>Doğru Yetenek, Kusursuz Proje</Text>
            </View>

            {menuView === 'main' && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.mainBtnWrapper} onPress={() => setMenuView('client')}>
                        <View style={[styles.mainBtn, { borderColor: '#00f2fe' }]}>
                            <Text style={styles.emoji}>👨‍💼</Text>
                            <Text style={styles.mainBtnText}>Müşteri Paneli</Text>
                            <Text style={styles.descText}>Proje Yaptır & Yetenek Keşfet</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={styles.mainBtnWrapper} onPress={() => setMenuView('engineer')}>
                        <View style={[styles.mainBtn, { borderColor: '#f093fb' }]}>
                            <Text style={styles.emoji}>👩‍💻</Text>
                            <Text style={styles.mainBtnText}>Mühendis Paneli</Text>
                            <Text style={styles.descText}>Portfolyo Sun & İş Al</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {menuView === 'client' && (
                <View style={styles.subMenuContainer}>
                    <Text style={[styles.sectionTitle, { color: '#00f2fe' }]}>👨‍💼 Müşteri Girişi</Text>
                    <Text style={styles.infoText}>Uygulamaya müşteri olarak devam et</Text>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00f2fe' }]} onPress={() => navigation.navigate('ClientLogin')}>
                        <Text style={styles.actionBtnText}>Mevcut Müşteri</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.outlineBtn, { borderColor: '#00f2fe' }]} onPress={() => navigation.navigate('ClientRegister')}>
                        <Text style={[styles.outlineBtnText, { color: '#00f2fe' }]}>Yeni Müşteri Kaydı</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backBtn} onPress={() => setMenuView('main')}>
                        <Text style={styles.backBtnText}>⬅ Geri Dön</Text>
                    </TouchableOpacity>
                </View>
            )}

            {menuView === 'engineer' && (
                <View style={styles.subMenuContainer}>
                    <Text style={[styles.sectionTitle, { color: '#f093fb' }]}>👩‍💻 Mühendis Girişi</Text>
                    <Text style={styles.infoText}>Uygulamaya mühendis olarak devam et</Text>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f093fb' }]} onPress={() => navigation.navigate('EngineerLogin')}>
                        <Text style={styles.actionBtnText}>Mevcut Mühendis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.outlineBtn, { borderColor: '#f093fb' }]} onPress={() => navigation.navigate('EngineerRegister')}>
                        <Text style={[styles.outlineBtnText, { color: '#f093fb' }]}>Yeni Mühendis Kaydı</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backBtn} onPress={() => setMenuView('main')}>
                        <Text style={styles.backBtnText}>⬅ Geri Dön</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A12', justifyContent: 'center', padding: 20 },
    header: { alignItems: 'center', marginBottom: 50 },
    logoText: { fontFamily: 'Arial', fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: 1 },
    subtitle: { fontFamily: 'Arial', fontSize: 16, color: '#8A8A9E', marginTop: 8 },

    menuContainer: { gap: 25, width: '100%', alignItems: 'center' },
    mainBtnWrapper: { width: width * 0.85 },
    mainBtn: { backgroundColor: '#131320', padding: 30, borderRadius: 24, alignItems: 'center', borderWidth: 1 },
    emoji: { fontSize: 40, marginBottom: 15 },
    mainBtnText: { fontFamily: 'Arial', color: '#fff', fontWeight: 'bold', fontSize: 22, marginBottom: 8 },
    descText: { fontFamily: 'Arial', color: '#8A8A9E', fontSize: 14 },

    subMenuContainer: { backgroundColor: '#131320', padding: 30, borderRadius: 24, width: '100%', borderWidth: 1, borderColor: '#2A2A3E', alignItems: 'center' },
    sectionTitle: { fontFamily: 'Arial', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    infoText: { fontFamily: 'Arial', color: '#8A8A9E', fontSize: 14, marginBottom: 30 },

    actionBtn: { width: '100%', padding: 18, borderRadius: 14, alignItems: 'center', marginBottom: 15 },
    actionBtnText: { fontFamily: 'Arial', color: '#0A0A12', fontWeight: 'bold', fontSize: 16 },

    outlineBtn: { backgroundColor: 'transparent', borderWidth: 1 },
    outlineBtnText: { fontFamily: 'Arial', fontWeight: 'bold', fontSize: 16 },

    backBtn: { marginTop: 15, padding: 10 },
    backBtnText: { fontFamily: 'Arial', color: '#8A8A9E', fontWeight: 'bold', fontSize: 16 }
});