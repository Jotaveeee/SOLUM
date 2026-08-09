import { NavigationContainer } from '@react-navigation/native';

// Importar as rotas de navegação
import startRoutes from './startRoutes';

export default function Routes() {
    return (
        <NavigationContainer>
            <startRoutes />
        </NavigationContainer>
    );
}