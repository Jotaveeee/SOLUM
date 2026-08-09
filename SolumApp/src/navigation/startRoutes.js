import {createNativeStackNavigator} from '@react-navigation/native-stack';

//Imports das screens

const Stack = createNativeStackNavigator();

export default function startRoutes() {
    return (
        <Stack.Navigator 
        screenOptions={{
        headerShown: false
      }}
>
            <Stack.Screen name="Home" component={} />
        </Stack.Navigator>
    );
}