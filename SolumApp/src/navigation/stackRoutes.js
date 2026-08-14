import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Start from '../screens/Start';
import Register from '../screens/Register';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
    return (
        <Stack.Navigator 
        screenOptions={{
        headerShown: false
      }}
>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name='Start' component={Start} />
            <Stack.Screen name='Register' component={Register}/>
        </Stack.Navigator>
    );
}