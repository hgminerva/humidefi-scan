export class AppSettings {
    public wsProviderEndpoint = localStorage.getItem('network') == 'Mainnet' ? 'ws://127.0.0.1:9948' : 
        localStorage.getItem('network') == 'Testnet' ? 'ws://127.0.0.1:9948' : 
        localStorage.getItem('network') == 'Local' ? 'ws://127.0.0.1:9948' : 
        localStorage.getItem('network') == 'Polkadot' ? 'wss://rpc.polkadot.io' : 
        localStorage.getItem('network') == 'Astar' ? 'wss://astar.public.blastapi.io' :
        localStorage.getItem('network') == 'Acala' ? 'wss://acala-rpc.dwellir.com' : 'ws://127.0.0.1:9948';

    public keypair = localStorage.getItem("wallet-keypair") || "";
    public phpuContractAddress = localStorage.getItem("phpu-contract-address") || "";
}