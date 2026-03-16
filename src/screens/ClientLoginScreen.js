import { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function ClientLoginScreen({ navigation }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const { clients, setCurrentClient } = useContext(AppContext);

    const handleLogin = () => {
        const client = clients.find(c => c.name === name && c.password === password);
        if (client) {
            setCurrentClient(client);
            navigation.replace('ClientMarketplace');
        } else {
            Alert.alert('Hata', 'Müşteri adı veya şifre yanlış!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Müşteri Girişi</Text>
            <TextInput style={styles.input} placeholder="Ad Soyad" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Şifre" placeholderTextColor="#aaa" secureTextEntry={true} value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.btnText}>Giriş Yap</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1e1e2d', padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    input: { backgroundColor: '#2a2a3c', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
    button: { backgroundColor: '#4facfe', padding: 15, borderRadius: 10, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});