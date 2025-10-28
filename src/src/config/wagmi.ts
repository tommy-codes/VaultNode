import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: '',
  projectId: 'confidential-usdt-demo',
  chains: [sepolia],
  ssr: false,
});
