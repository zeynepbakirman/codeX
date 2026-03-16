import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function EngineerDashboardScreen({ navigation }) {
    const { currentDev, setCurrentDev, developers, clients, acceptJob, rejectJob, finishJob, updateProfile, markDevOffersAsRead } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Pazaryeri');

    const [about, setAbout] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [clientModalVisible, setClientModalVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [devModalVisible, setDevModalVisible] = useState(false);
    const [selectedViewDev, setSelectedViewDev] = useState(null);

    useEffect(() => {
        if (currentDev) {
            setAbout(currentDev.about || ''); setGithub(currentDev.github || ''); setLinkedin(currentDev.linkedin || '');
        }
    }, [currentDev]);

    if (!currentDev) return null;

    const handleTabPress = (tab) => {
        setActiveTab(tab);
        if (tab === 'Bildirim') markDevOffersAsRead(currentDev.id);
    };

    const handleProfileBtn = () => {
        if (isEditing) {
            updateProfile(currentDev.id, about, github, linkedin);
            Alert.alert("Başarılı", "Profiliniz güncellendi!");
            setIsEditing(false);
        } else setIsEditing(true);
    };

    const handleLogout = () => { setCurrentDev(null); navigation.replace('Welcome'); };
    const openClientProfile = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        if (client) { setSelectedClient(client); setClientModalVisible(true); }
        else { Alert.alert("Bilgi", "Bu talep sistemde kayıtlı olmayan birinden gelmiş."); }
    };
    const openDevProfile = (dev) => { setSelectedViewDev(dev); setDevModalVisible(true); };
    const openLink = (url) => { if (url) Linking.openURL(url).catch(err => Alert.alert("Hata", "Link açılamadı.")); };

    const unreadCount = (currentDev.offers || []).filter(o => !o.isRead).length;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerGreeting}>Hoşgeldin, {currentDev.name}!</Text>
                <TouchableOpacity style={styles.logoutSmBtn} onPress={handleLogout}>
                    <Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Çıkış</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                {['Profil', 'Pazaryeri', 'Bildirim', 'İşlerim'].map(tab => (
                    <TouchableOpacity key={tab} onPress={() => handleTabPress(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === tab && { color: '#00f2fe', fontWeight: 'bold' }]}>
                            {tab}
                            {tab === 'Bildirim' && unreadCount > 0 ? ` (${unreadCount})` : ''}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.content}>
                {activeTab === 'Profil' && (
                    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                        <View style={styles.glassCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 35 }}>{currentDev.gender === 'erkek' ? '👨‍💻' : '👩‍💻'}</Text>
                                    <View><Text style={styles.name}>{currentDev.name}</Text><Text style={styles.role}>{currentDev.role}</Text></View>
                                </View>
                                <View style={styles.levelBadge}><Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold' }}>Lvl {currentDev.level}</Text></View>
                            </View>
                            <View style={styles.xpBar}><View style={[styles.xpFill, { width: `${(currentDev.xp % 100)}%` }]} /></View>
                            <Text style={{ fontFamily: 'Arial', color: '#a0a0b0', fontSize: 12, marginBottom: 20, alignSelf: 'flex-end' }}><Text style={{ fontWeight: 'bold' }}>{currentDev.xp}</Text> Toplam XP</Text>
                            <Text style={styles.inputLabel}>Hakkımda</Text>
                            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }, !isEditing && { opacity: 0.6 }]} editable={isEditing} multiline placeholder="Kendinden bahset..." placeholderTextColor="#666" value={about} onChangeText={setAbout} />
                            <Text style={styles.inputLabel}>GitHub Linki</Text>
                            <TextInput style={[styles.input, !isEditing && { opacity: 0.6 }]} editable={isEditing} placeholder="https://github.com/..." placeholderTextColor="#666" value={github} onChangeText={setGithub} />
                            <Text style={styles.inputLabel}>LinkedIn Linki</Text>
                            <TextInput style={[styles.input, !isEditing && { opacity: 0.6 }]} editable={isEditing} placeholder="https://linkedin.com/in/..." placeholderTextColor="#666" value={linkedin} onChangeText={setLinkedin} />
                            <TouchableOpacity style={[styles.saveBtn, isEditing ? { backgroundColor: '#2ed573' } : { backgroundColor: '#f093fb' }]} onPress={handleProfileBtn}>
                                <Text style={{ fontFamily: 'Arial', color: isEditing ? '#fff' : '#0f0f1a', fontWeight: 'bold', fontSize: 16 }}>{isEditing ? 'Kaydet' : 'Profili Düzenle'}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}

                {activeTab === 'Pazaryeri' && (
                    <FlatList style={{ width: '100%' }} data={developers} keyExtractor={item => item.id} renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.8} style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => openDevProfile(item)}>
                            <Text style={{ fontSize: 35, marginRight: 15 }}>{item.gender === 'erkek' ? '👨‍💻' : '👩‍💻'}</Text>
                            <View style={{ flex: 1 }}><Text style={styles.name}>{item.name}</Text><Text style={styles.role}>{item.role}</Text><View style={styles.levelBadgeSm}><Text style={{ fontFamily: 'Arial', color: '#00f2fe', fontSize: 12, fontWeight: 'bold' }}>Lvl {item.level}</Text></View></View>
                            <Text style={{ fontFamily: 'Arial', fontSize: 24, color: '#4facfe' }}>{'>'}</Text>
                        </TouchableOpacity>
                    )} />
                )}

                {activeTab === 'Bildirim' && (
                    <FlatList style={{ width: '100%' }} data={currentDev.offers} keyExtractor={item => item.id} ListEmptyComponent={<Text style={styles.emptyText}>Bildiriminiz yok.</Text>} renderItem={({ item }) => (
                        <View style={styles.card}>
                            <TouchableOpacity onPress={() => openClientProfile(item.fromId)}>
                                <Text style={styles.sender}>Talep: <Text style={{ textDecorationLine: 'underline', color: '#00f2fe', fontWeight: 'bold' }}>{item.from} 🔍</Text></Text>
                            </TouchableOpacity>
                            <Text style={styles.message}>"{item.message}"</Text>
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#2ed573' }]} onPress={() => acceptJob(currentDev.id, item.id)}><Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold' }}>Kabul Et</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#ff4757' }]} onPress={() => rejectJob(currentDev.id, item.id)}><Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold' }}>Reddet</Text></TouchableOpacity>
                            </View>
                        </View>
                    )} />
                )}

                {activeTab === 'İşlerim' && (
                    <FlatList style={{ width: '100%' }} data={currentDev.activeJobs} keyExtractor={item => item.id} ListEmptyComponent={<Text style={styles.emptyText}>Aktif işiniz yok.</Text>} renderItem={({ item }) => (
                        <View style={[styles.card, { borderColor: item.status === 'Tamamlandı' ? '#2ed573' : '#00f2fe', borderWidth: 1 }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => openClientProfile(item.fromId)}>
                                    <Text style={styles.sender}>Müşteri: <Text style={{ textDecorationLine: 'underline', color: item.status === 'Tamamlandı' ? '#2ed573' : '#00f2fe', fontWeight: 'bold' }}>{item.from} 🔍</Text></Text>
                                </TouchableOpacity>
                                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Tamamlandı' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(0, 242, 254, 0.2)' }]}>
                                    <Text style={[styles.badgeText, { color: item.status === 'Tamamlandı' ? '#2ed573' : '#00f2fe' }]}>{item.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.message}>Görev: "{item.message}"</Text>

                            {item.status !== 'Tamamlandı' && (
                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00f2fe', marginTop: 15 }]} onPress={() => finishJob(currentDev.id, item.id)}>
                                    <Text style={{ fontFamily: 'Arial', color: '#0f0f1a', fontWeight: 'bold', fontSize: 16 }}>İşi Bitir (+50 XP)</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )} />
                )}
            </View>

            <Modal visible={clientModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 50, marginBottom: 10 }}>{selectedClient?.gender === 'erkek' ? '👨💼' : '👩💼'}</Text>
                        <Text style={[styles.name, { fontSize: 26, marginBottom: 5 }]}>{selectedClient?.name}</Text>
                        <Text style={styles.role}>Kayıtlı Müşteri (İş Veren)</Text>
                        <View style={{ height: 1, backgroundColor: '#2a2a3e', marginVertical: 20, width: '100%' }} />
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ff4757', width: '100%' }]} onPress={() => setClientModalVisible(false)}>
                            <Text style={{ fontFamily: 'Arial', color: '#ff4757', fontWeight: 'bold', fontSize: 16 }}>⬅ Geri Dön</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={devModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 50, marginBottom: 10 }}>{selectedViewDev?.gender === 'erkek' ? '👨‍💻' : '👩‍💻'}</Text>
                        <Text style={[styles.name, { fontSize: 26 }]}>{selectedViewDev?.name}</Text>
                        <Text style={styles.role}>{selectedViewDev?.role} | <Text style={{ fontWeight: 'bold' }}>Seviye {selectedViewDev?.level}</Text></Text>
                        <Text style={{ fontFamily: 'Arial', color: '#f093fb', fontSize: 14, fontWeight: 'bold', marginBottom: 5, alignSelf: 'flex-start' }}>Hakkında</Text>
                        <Text style={{ fontFamily: 'Arial', color: '#fff', fontSize: 14, lineHeight: 22, marginBottom: 20, textAlign: 'left', width: '100%' }}>{selectedViewDev?.about || 'Henüz bir bilgi girilmemiş.'}</Text>

                        {/* DİNAMİK SOSYAL LİNKLER KISMI BURASI */}
                        {(!selectedViewDev?.github && !selectedViewDev?.linkedin) ? (
                            <Text style={{ fontFamily: 'Arial', color: '#a0a0b0', fontStyle: 'italic', marginBottom: 20 }}>Henüz sosyal link eklenmemiş.</Text>
                        ) : (
                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20, width: '100%' }}>
                                {selectedViewDev?.github && (
                                    <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#333' }]} onPress={() => openLink(selectedViewDev.github)}>
                                        <Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold' }}>🔗 GitHub</Text>
                                    </TouchableOpacity>
                                )}
                                {selectedViewDev?.linkedin && (
                                    <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#0077b5' }]} onPress={() => openLink(selectedViewDev.linkedin)}>
                                        <Text style={{ fontFamily: 'Arial', color: '#fff', fontWeight: 'bold' }}>🔗 LinkedIn</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ff4757', width: '100%' }]} onPress={() => setDevModalVisible(false)}>
                            <Text style={{ fontFamily: 'Arial', color: '#ff4757', fontWeight: 'bold', fontSize: 16 }}>⬅ Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f1a' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
    headerGreeting: { fontFamily: 'Arial', color: '#fff', fontSize: 18, fontWeight: 'bold' },
    logoutSmBtn: { backgroundColor: '#ff4757', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15 },
    tabContainer: { flexDirection: 'row', backgroundColor: '#1a1a2e', paddingBottom: 10, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#2a2a3e' },
    tab: { paddingVertical: 10, paddingHorizontal: 5 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#00f2fe' },
    tabText: { fontFamily: 'Arial', color: '#a0a0b0', fontSize: 13 },
    content: { flex: 1, padding: 20 },
    emptyText: { fontFamily: 'Arial', color: '#a0a0b0', textAlign: 'center', marginTop: 50 },

    glassCard: { width: '100%', backgroundColor: '#1a1a2e', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#2a2a3e' },
    name: { fontFamily: 'Arial', fontSize: 22, fontWeight: 'bold', color: '#fff' },
    role: { fontFamily: 'Arial', fontSize: 14, color: '#00f2fe' },
    levelBadge: { backgroundColor: 'rgba(0, 242, 254, 0.2)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, height: 30, justifyContent: 'center' },
    levelBadgeSm: { backgroundColor: 'rgba(0, 242, 254, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginTop: 5 },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    badgeText: { fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' },
    xpBar: { width: '100%', height: 6, backgroundColor: '#2a2a3e', borderRadius: 3, overflow: 'hidden', marginTop: 10 },
    xpFill: { height: '100%', backgroundColor: '#00f2fe' },

    inputLabel: { fontFamily: 'Arial', color: '#a0a0b0', fontSize: 12, marginBottom: 5, marginTop: 15, fontWeight: 'bold' },
    input: { fontFamily: 'Arial', backgroundColor: '#0f0f1a', color: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2a2a3e' },
    saveBtn: { marginTop: 20, padding: 15, borderRadius: 10, alignItems: 'center' },

    card: { backgroundColor: '#1a1a2e', padding: 20, borderRadius: 15, width: '100%', marginBottom: 15, borderWidth: 1, borderColor: '#2a2a3e' },
    sender: { fontFamily: 'Arial', color: '#f093fb', marginBottom: 5 },
    message: { fontFamily: 'Arial', color: '#fff', fontStyle: 'italic', fontSize: 16 },
    smallBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
    actionBtn: { padding: 15, borderRadius: 10, alignItems: 'center' },

    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#1a1a2e', padding: 25, borderRadius: 20, width: '85%', borderWidth: 1, borderColor: '#4facfe', alignItems: 'center' }
});