import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function EngineerRegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('kadin');
    const { registerDeveloper } = useContext(AppContext);

    const handleRegister = async () => {
        if (name && role && password) {
            await registerDeveloper(name, role, password, gender);
            navigation.replace('EngineerDashboard');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mühendis Profili Oluştur</Text>

            <View style={styles.genderRow}>
                <TouchableOpacity style={[styles.genderBtn, gender === 'kadin' && styles.activeGender]} onPress={() => setGender('kadin')}>
                    <Text style={styles.genderText}>👩‍💻 Kadın</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.genderBtn, gender === 'erkek' && styles.activeGender]} onPress={() => setGender('erkek')}>
                    <Text style={styles.genderText}>👨‍💻 Erkek</Text>
                </TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="Ad Soyad" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Uzmanlık (Örn: Yazılım Müh.)" placeholderTextColor="#aaa" value={role} onChangeText={setRole} />
            <TextInput style={styles.input} placeholder="Şifre Belirle" placeholderTextColor="#aaa" secureTextEntry={true} value={password} onChangeText={setPassword} />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.btnText}>Kimliğimi Oluştur</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, justifyContent: 'center' },
    title: { fontFamily: 'Arial', fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    genderRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    genderBtn: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2a2a3e', alignItems: 'center' },
    activeGender: { borderColor: '#00f2fe', backgroundColor: 'rgba(0, 242, 254, 0.1)' },
    genderText: { fontFamily: 'Arial', color: '#fff', fontWeight: 'bold', fontSize: 16 },
    input: { fontFamily: 'Arial', backgroundColor: '#1a1a2e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#2a2a3e' },
    button: { backgroundColor: '#00f2fe', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { fontFamily: 'Arial', color: '#0f0f1a', fontWeight: 'bold', fontSize: 16 }
});