export class AppSettings {
    public wsProviderEndpoint = 'ws://127.0.0.1:9948';
    public keypair = localStorage.getItem("wallet-keypair") || "";
    public phpuContractAddress = localStorage.getItem("phpu-contract-address") || "";
}