import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';

import ClientLoginScreen from './src/screens/ClientLoginScreen';
import ClientMarketplaceScreen from './src/screens/ClientMarketplaceScreen';
import ClientRegisterScreen from './src/screens/ClientRegisterScreen';
import EngineerDashboardScreen from './src/screens/EngineerDashboardScreen';
import EngineerLoginScreen from './src/screens/EngineerLoginScreen';
import EngineerRegisterScreen from './src/screens/EngineerRegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                {/* headerShown: false sayesinde o çirkin üst bar HER YERDEN kalkıyor */}
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="EngineerRegister" component={EngineerRegisterScreen} />
                    <Stack.Screen name="EngineerLogin" component={EngineerLoginScreen} />
                    <Stack.Screen name="ClientRegister" component={ClientRegisterScreen} />
                    <Stack.Screen name="ClientLogin" component={ClientLoginScreen} />
                    <Stack.Screen name="EngineerDashboard" component={EngineerDashboardScreen} />
                    <Stack.Screen name="ClientMarketplace" component={ClientMarketplaceScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
    );
}