import { NavigationContainer } from '@react-navigation/native';

// Importar as rotas de navegação
import StackRoutes from './stackRoutes';

export default function Routes() {
    return (
        <NavigationContainer>
            <StackRoutes />
        </NavigationContainer>
    );
}