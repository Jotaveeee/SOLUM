import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Start from '../screens/Start';
import Register from '../screens/Register';
import Recover from '../screens/Recover';
import Redefine from '../screens/Redefine';

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
            <Stack.Screen name='Recover' component={Recover}/>
            <Stack.Screen name='Redefine' component={Redefine}/>
        </Stack.Navigator>
    );
}