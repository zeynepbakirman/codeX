import { useContext, useState } from 'react';
import { Alert, FlatList, Linking, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function ClientMarketplaceScreen({ navigation }) {
    const { developers, sendJobOffer, currentClient, setCurrentClient, markClientNotificationsAsRead } = useContext(AppContext);

    const [activeTab, setActiveTab] = useState('Pazaryeri');
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [offerModalVisible, setOfferModalVisible] = useState(false);
    const [selectedDev, setSelectedDev] = useState(null);
    const [message, setMessage] = useState('');

    if (!currentClient) return null;

    const handleTabPress = (tab) => {
        setActiveTab(tab);
        if (tab === 'Bildirimler') markClientNotificationsAsRead(currentClient.id);
    };

    const handleLogout = () => { setCurrentClient(null); navigation.replace('Welcome'); };
    const openProfile = (dev) => { setSelectedDev(dev); setProfileModalVisible(true); };
    const openLink = (url) => { if (url) Linking.openURL(url).catch(err => Alert.alert("Hata", "Link açılamadı.")); };

    const handleDevClick = (devId) => {
        if (devId) {
            const dev = developers.find(d => d.id === devId);
            if (dev) openProfile(dev);
        }
    };

    const handleSendOffer = () => {
        if (message.trim().length > 0) {
            sendJobOffer(selectedDev.id, message);
            setOfferModalVisible(false); setMessage('');
            Alert.alert("Başarılı", `${selectedDev.name} adlı mühendise teklif iletildi!`);
        }
    };

    const unreadCount = (currentClient.notifications || []).filter(n => !n.isRead).length;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={{ fontFamily: 'Arial', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    Hoşgeldin, {currentClient.name}!
                </Text>
                <TouchableOpacity style={styles.logoutSmBtn} onPress={handleLogout}>
                    <Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Çıkış</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                {['Pazaryeri', 'Bildirimler', 'İşlerim'].map(tab => (
                    <TouchableOpacity key={tab} onPress={() => handleTabPress(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === tab && { color: '#f093fb', fontWeight: 'bold' }]}>
                            {tab}
                            {tab === 'Bildirimler' && unreadCount > 0 ? ` (${unreadCount})` : ''}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.content}>
                {activeTab === 'Pazaryeri' && (
                    <FlatList data={developers} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => openProfile(item)}>
                            <Text style={{ fontSize: 35, marginRight: 15 }}>{item.gender === 'erkek' ? '👨‍💻' : '👩‍💻'}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.role}>{item.role}</Text>
                                <View style={styles.badgeRow}>
                                    <View style={styles.levelBadge}><Text style={styles.badgeText}>Lvl {item.level}</Text></View>
                                    <View style={[styles.statusBadge, { backgroundColor: item.isAvailable ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)' }]}>
                                        <Text style={[styles.badgeText, { color: item.isAvailable ? '#2ed573' : '#ff4757' }]}>{item.isAvailable ? "Müsait" : "Meşgul"}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={{ fontFamily: 'Arial', fontSize: 24, color: '#4facfe' }}>{'>'}</Text>
                        </TouchableOpacity>
                    )} />
                )}

                {activeTab === 'Bildirimler' && (
                    <FlatList data={currentClient.notifications} keyExtractor={item => item.id} ListEmptyComponent={<Text style={styles.emptyText}>Henüz bildiriminiz yok.</Text>} renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => handleDevClick(item.devId)}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.message}>{item.text}</Text>
                                <Text style={{ fontFamily: 'Arial', color: '#f093fb', fontSize: 13, marginTop: 10, fontWeight: 'bold' }}>Mühendisin Profilini Gör ➔</Text>
                            </View>
                        </TouchableOpacity>
                    )} />
                )}

                {activeTab === 'Yaptırdığım Projeler' && (
                    <FlatList data={currentClient.myJobs} keyExtractor={item => item.id} ListEmptyComponent={<Text style={styles.emptyText}>Henüz bir proje başlatmadınız.</Text>} renderItem={({ item }) => (
                        <View style={[styles.card, { borderColor: item.status === 'Tamamlandı' ? '#2ed573' : '#00f2fe', borderWidth: 1 }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                                <TouchableOpacity style={{ flex: 1, paddingRight: 10 }} onPress={() => handleDevClick(item.devId)}>
                                    <Text style={{ fontFamily: 'Arial', color: '#a0a0b0', fontSize: 12 }}>Mühendis:</Text>
                                    <Text style={{ fontFamily: 'Arial', textDecorationLine: 'underline', color: '#f093fb', fontSize: 18, fontWeight: 'bold' }}>{item.devName} 🔍</Text>
                                </TouchableOpacity>
                                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Tamamlandı' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(0, 242, 254, 0.2)' }]}>
                                    <Text style={[styles.badgeText, { color: item.status === 'Tamamlandı' ? '#2ed573' : '#00f2fe' }]}>{item.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.message}>Görev: "{item.task}"</Text>
                        </View>
                    )} />
                )}
            </View>

            <Modal visible={profileModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 50, marginBottom: 10 }}>{selectedDev?.gender === 'erkek' ? '👨‍💻' : '👩‍💻'}</Text>
                        <Text style={[styles.name, { fontSize: 26 }]}>{selectedDev?.name}</Text>
                        <Text style={styles.role}>{selectedDev?.role} | <Text style={{ fontWeight: 'bold' }}>Seviye {selectedDev?.level}</Text></Text>

                        <Text style={styles.sectionTitle}>Hakkında</Text>
                        <Text style={styles.aboutText}>{selectedDev?.about || 'Henüz bir bilgi girilmemiş.'}</Text>

                        {/* DİNAMİK SOSYAL LİNKLER KISMI BURASI */}
                        {(!selectedDev?.github && !selectedDev?.linkedin) ? (
                            <Text style={{ fontFamily: 'Arial', color: '#a0a0b0', fontStyle: 'italic', marginBottom: 25 }}>Henüz sosyal link eklenmemiş.</Text>
                        ) : (
                            <View style={styles.linkRow}>
                                {selectedDev?.github && (
                                    <TouchableOpacity style={[styles.linkBtn, { backgroundColor: '#333' }]} onPress={() => openLink(selectedDev.github)}>
                                        <Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold' }}>🔗 GitHub</Text>
                                    </TouchableOpacity>
                                )}
                                {selectedDev?.linkedin && (
                                    <TouchableOpacity style={[styles.linkBtn, { backgroundColor: '#0077b5' }]} onPress={() => openLink(selectedDev.linkedin)}>
                                        <Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold' }}>🔗 LinkedIn</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <TouchableOpacity style={[styles.mainBtn, !selectedDev?.isAvailable && { backgroundColor: '#ff4757' }]} disabled={!selectedDev?.isAvailable} onPress={() => { setProfileModalVisible(false); setTimeout(() => setOfferModalVisible(true), 300); }}>
                            <Text style={styles.mainBtnText}>{selectedDev?.isAvailable ? "Hemen İş Teklif Et" : "Şu An Başka Projede"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.mainBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ff4757', marginTop: 15 }]} onPress={() => setProfileModalVisible(false)}>
                            <Text style={[styles.mainBtnText, { color: '#ff4757' }]}>⬅ Geri Dön</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={offerModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.name, { fontSize: 24, marginBottom: 15 }]}>Teklif Gönder</Text>
                        <TextInput style={styles.modalInput} placeholder="Projeden kısaca bahset..." placeholderTextColor="#888" maxLength={60} value={message} onChangeText={setMessage} multiline />
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                            <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#ff4757' }]} onPress={() => setOfferModalVisible(false)}><Text style={styles.mainBtnText}>İptal</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#2ed573' }]} onPress={handleSendOffer}><Text style={styles.mainBtnText}>Gönder</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f1a' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20 },
    logoutSmBtn: { backgroundColor: '#ff4757', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15 },

    tabContainer: { flexDirection: 'row', backgroundColor: '#1a1a2e', paddingBottom: 10, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#2a2a3e' },
    tab: { paddingVertical: 10, paddingHorizontal: 5 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#f093fb' },
    tabText: { fontFamily: 'Arial', color: '#a0a0b0', fontSize: 13 },
    content: { flex: 1, padding: 20 },
    emptyText: { fontFamily: 'Arial', color: '#a0a0b0', textAlign: 'center', marginTop: 50 },

    card: { backgroundColor: '#1a1a2e', padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#2a2a3e' },
    name: { fontFamily: 'Arial', color: '#fff', fontSize: 20, fontWeight: 'bold' },
    role: { fontFamily: 'Arial', color: '#00f2fe', fontSize: 14, marginBottom: 10 },
    sender: { fontFamily: 'Arial', color: '#f093fb', fontSize: 16 },
    message: { fontFamily: 'Arial', color: '#fff', fontSize: 16, marginTop: 5, fontStyle: 'italic' },

    badgeRow: { flexDirection: 'row', gap: 10 },
    levelBadge: { backgroundColor: 'rgba(0, 242, 254, 0.2)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    badgeText: { fontFamily: 'Arial', color: '#00f2fe', fontSize: 12, fontWeight: 'bold' },

    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#1a1a2e', padding: 25, borderRadius: 20, width: '90%', borderWidth: 1, borderColor: '#f093fb', alignItems: 'center' },
    sectionTitle: { fontFamily: 'Arial', color: '#f093fb', fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    aboutText: { fontFamily: 'Arial', color: '#fff', fontSize: 14, lineHeight: 22, marginBottom: 20, textAlign: 'center' },
    linkRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
    linkBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
    mainBtn: { backgroundColor: '#f093fb', padding: 15, borderRadius: 12, alignItems: 'center', width: '100%' },
    mainBtnText: { fontFamily: 'Arial', color: '#0f0f1a', fontWeight: 'bold', fontSize: 16 },
    modalInput: { fontFamily: 'Arial', backgroundColor: '#0f0f1a', color: '#fff', padding: 15, borderRadius: 12, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#2a2a3e', marginTop: 15, width: '100%' },
    smallBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center' }
});