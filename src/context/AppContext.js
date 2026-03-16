import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

// VİDEO İÇİN TERTEMİZ 3 MÜHENDİS (Mehmet Demir Meşgul Yapıldı!)
const MOCK_DEVS = [
    { id: '1', name: 'Ahmet Yılmaz', password: '123', role: 'Backend Dev', gender: 'erkek', level: 3, xp: 250, isAvailable: true, offers: [], activeJobs: [], about: 'Sunucu mimarilerinde ve API geliştirmede uzmanım.', github: '', linkedin: '' },
    { id: '2', name: 'Ayşe Kaya', password: '123', role: 'Mobile Dev', gender: 'kadin', level: 2, xp: 150, isAvailable: true, offers: [], activeJobs: [], about: 'React Native ile harika mobil arayüzler tasarlarım.', github: '', linkedin: '' },
    { id: '3', name: 'Mehmet Demir', password: '123', role: 'UI/UX Designer', gender: 'erkek', level: 4, xp: 350, isAvailable: false, offers: [], activeJobs: [], about: 'Kullanıcı deneyimi odaklı, modern arayüzler kurgularım.', github: '', linkedin: '' },
];

const MOCK_CLIENTS = [];

export const AppProvider = ({ children }) => {
    const [developers, setDevelopers] = useState([]);
    const [clients, setClients] = useState([]);
    const [currentDev, setCurrentDev] = useState(null);
    const [currentClient, setCurrentClient] = useState(null);

    useEffect(() => { loadData(); }, []);

    useEffect(() => { if (currentDev) setCurrentDev(developers.find(d => d.id === currentDev.id)); }, [developers]);
    useEffect(() => { if (currentClient) setCurrentClient(clients.find(c => c.id === currentClient.id)); }, [clients]);

    const loadData = async () => {
        try {
            // DİKKAT: Veritabanı "_v4" oldu ki Meşgul durumu anında yansısın.
            const storedDevs = await AsyncStorage.getItem('@developers_v4');
            const storedClients = await AsyncStorage.getItem('@clients_v4');

            if (storedDevs) setDevelopers(JSON.parse(storedDevs));
            else { setDevelopers(MOCK_DEVS); await AsyncStorage.setItem('@developers_v4', JSON.stringify(MOCK_DEVS)); }

            if (storedClients) setClients(JSON.parse(storedClients));
            else { setClients(MOCK_CLIENTS); await AsyncStorage.setItem('@clients_v4', JSON.stringify(MOCK_CLIENTS)); }
        } catch (e) { console.log("Hata", e); }
    };

    const updateDevs = async (newDevs) => { setDevelopers(newDevs); await AsyncStorage.setItem('@developers_v4', JSON.stringify(newDevs)); };
    const updateClients = async (newClients) => { setClients(newClients); await AsyncStorage.setItem('@clients_v4', JSON.stringify(newClients)); };

    const registerDeveloper = async (name, role, password, gender) => {
        const newDev = { id: Date.now().toString(), name, role, password, gender, level: 1, xp: 0, isAvailable: true, offers: [], activeJobs: [], about: '', github: '', linkedin: '' };
        updateDevs([...developers, newDev]); setCurrentDev(newDev);
    };

    const registerClient = async (name, password, gender) => {
        const newClient = { id: Date.now().toString(), name, password, gender, notifications: [], myJobs: [] };
        updateClients([...clients, newClient]); setCurrentClient(newClient);
    };

    const updateProfile = (devId, about, github, linkedin) => {
        updateDevs(developers.map(dev => dev.id === devId ? { ...dev, about, github, linkedin } : dev));
    };

    const sendJobOffer = async (devId, message) => {
        const storedDevs = JSON.parse(await AsyncStorage.getItem('@developers_v4')) || developers;
        const newDevs = storedDevs.map(dev => {
            if (dev.id === devId) {
                const senderId = currentClient ? currentClient.id : (currentDev ? currentDev.id : 'unknown');
                const senderName = currentClient ? currentClient.name : (currentDev ? currentDev.name : 'Bilinmeyen');
                const newOffer = { id: Date.now().toString(), fromId: senderId, from: senderName, message, isRead: false };
                return { ...dev, offers: [...(dev.offers || []), newOffer] };
            }
            return dev;
        });
        await updateDevs(newDevs);
    };

    const acceptJob = async (devId, offerId) => {
        const storedDevs = JSON.parse(await AsyncStorage.getItem('@developers_v4')) || developers;
        const storedClients = JSON.parse(await AsyncStorage.getItem('@clients_v4')) || clients;
        let acceptedOffer = null; let devName = ''; let devGender = '';

        const newDevs = storedDevs.map(dev => {
            if (dev.id === devId) {
                acceptedOffer = dev.offers.find(o => o.id === offerId); devName = dev.name; devGender = dev.gender;
                const newActiveJob = { ...acceptedOffer, status: 'Devam Ediyor' };
                return { ...dev, isAvailable: false, offers: dev.offers.filter(o => o.id !== offerId), activeJobs: [newActiveJob, ...(dev.activeJobs || [])] };
            }
            return dev;
        });
        await updateDevs(newDevs);

        if (acceptedOffer && acceptedOffer.fromId && acceptedOffer.fromId !== 'unknown') {
            const newClients = storedClients.map(c => {
                if (c.id === acceptedOffer.fromId) {
                    const notif = { id: Date.now().toString(), text: `✅ ${devName} teklifinizi KABUL ETTİ.`, devId, isRead: false };
                    const job = { id: acceptedOffer.id, devId, devName, devGender, task: acceptedOffer.message, status: 'Devam Ediyor' };
                    return { ...c, notifications: [notif, ...(c.notifications || [])], myJobs: [job, ...(c.myJobs || [])] };
                }
                return c;
            });
            await updateClients(newClients);
        }
    };

    const rejectJob = async (devId, offerId) => {
        const storedDevs = JSON.parse(await AsyncStorage.getItem('@developers_v4')) || developers;
        const storedClients = JSON.parse(await AsyncStorage.getItem('@clients_v4')) || clients;
        let rejectedOffer = null; let devName = '';

        const newDevs = storedDevs.map(dev => {
            if (dev.id === devId) {
                rejectedOffer = dev.offers.find(o => o.id === offerId); devName = dev.name;
                return { ...dev, offers: dev.offers.filter(o => o.id !== offerId) };
            }
            return dev;
        });
        await updateDevs(newDevs);

        if (rejectedOffer && rejectedOffer.fromId && rejectedOffer.fromId !== 'unknown') {
            const newClients = storedClients.map(c => {
                if (c.id === rejectedOffer.fromId) {
                    const notif = { id: Date.now().toString(), text: `❌ ${devName} teklifinizi REDDETTİ.`, devId, isRead: false };
                    return { ...c, notifications: [notif, ...(c.notifications || [])] };
                }
                return c;
            });
            await updateClients(newClients);
        }
    };

    const finishJob = async (devId, jobId) => {
        const storedDevs = JSON.parse(await AsyncStorage.getItem('@developers_v4')) || developers;
        const storedClients = JSON.parse(await AsyncStorage.getItem('@clients_v4')) || clients;

        const newDevs = storedDevs.map(dev => {
            if (dev.id === devId) {
                const updatedJobs = (dev.activeJobs || []).map(j => j.id === jobId ? { ...j, status: 'Tamamlandı' } : j);
                return { ...dev, isAvailable: true, xp: dev.xp + 50, level: Math.floor((dev.xp + 50) / 100) + 1, activeJobs: updatedJobs };
            }
            return dev;
        });
        await updateDevs(newDevs);

        const newClients = storedClients.map(c => {
            const hasJob = (c.myJobs || []).find(j => j.id === jobId);
            if (hasJob) {
                const updatedJobs = c.myJobs.map(j => j.id === jobId ? { ...j, status: 'Tamamlandı' } : j);
                const notif = { id: Date.now().toString(), text: `🎉 ${hasJob.devName} projenizi TAMAMLADI!`, devId, isRead: false };
                return { ...c, myJobs: updatedJobs, notifications: [notif, ...(c.notifications || [])] };
            }
            return c;
        });
        await updateClients(newClients);
    };

    const markDevOffersAsRead = async (devId) => {
        const storedDevs = JSON.parse(await AsyncStorage.getItem('@developers_v4')) || developers;
        const newDevs = storedDevs.map(dev => {
            if (dev.id === devId) return { ...dev, offers: (dev.offers || []).map(o => ({ ...o, isRead: true })) };
            return dev;
        });
        await updateDevs(newDevs);
    };

    const markClientNotificationsAsRead = async (clientId) => {
        const storedClients = JSON.parse(await AsyncStorage.getItem('@clients_v4')) || clients;
        const newClients = storedClients.map(c => {
            if (c.id === clientId) return { ...c, notifications: (c.notifications || []).map(n => ({ ...n, isRead: true })) };
            return c;
        });
        await updateClients(newClients);
    };

    return (
        <AppContext.Provider value={{ developers, clients, currentDev, currentClient, setCurrentDev, setCurrentClient, registerDeveloper, registerClient, updateProfile, sendJobOffer, acceptJob, rejectJob, finishJob, markDevOffersAsRead, markClientNotificationsAsRead }}>
            {children}
        </AppContext.Provider>
    );
};