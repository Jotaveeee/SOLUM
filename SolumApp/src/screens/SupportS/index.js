import SupportForm from '../SupportForm';
import { SUPPORT_EMAIL } from '../../services/support';
import styles from './styles';

export default function SupportS() {
  return <SupportForm styles={styles} recipient={SUPPORT_EMAIL} showBackButton />;
}
