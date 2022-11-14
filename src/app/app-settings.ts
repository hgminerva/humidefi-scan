export class AppSettings {
    public wsProviderEndpoint = localStorage.getItem('network') == 'Local' ? 'ws://127.0.0.1:8844' : 
        localStorage.getItem('network') == 'Testnet' ? 'wss://bootnode001.humidefi.com' : 
        localStorage.getItem('network') == 'Mainnet' ? 'wss://bootnode001.humidefi.com' : 
        localStorage.getItem('network') == 'Polkadot' ? 'wss://rpc.polkadot.io' : 
        localStorage.getItem('network') == 'Astar' ? 'wss://astar.public.blastapi.io' :
        localStorage.getItem('network') == 'Acala' ? 'wss://acala-rpc.dwellir.com' : 'wss://bootnode001.humidefi.com';

    public keypair = localStorage.getItem("wallet-keypair") || "";
    public phpuContractAddress = localStorage.getItem("phpu-contract-address") || "";
}