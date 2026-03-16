import { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function EngineerLoginScreen({ navigation }) {
    const { developers, setCurrentDev } = useContext(AppContext);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Girilen isim ve şifreyle eşleşen mühendisi bul
        const dev = developers.find(d => d.name === name && d.password === password);

        if (dev) {
            setCurrentDev(dev);
            navigation.replace('EngineerDashboard');
        } else {
            Alert.alert('Giriş Başarısız', 'Kullanıcı adı veya şifre yanlış!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mühendis Girişi</Text>

            <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#aaa"
                secureTextEntry={true} // Şifreyi yıldızlı gösterir
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.btnText}>Giriş Yap</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1e1e2d', padding: 20, justifyContent: 'center' },
    title: { fontSize: 28, color: '#fff', marginBottom: 30, textAlign: 'center', fontWeight: 'bold' },
    input: { backgroundColor: '#2a2a3c', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
    button: { backgroundColor: '#6c5ce7', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});