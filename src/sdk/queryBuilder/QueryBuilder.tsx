import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { Address, ContractFunction, ResultsParser, SmartContract } from '@elrondnetwork/erdjs/out';


export default class QueryBuilder {

  private networkProvider: ProxyNetworkProvider;

  constructor() {
    this.networkProvider = new ProxyNetworkProvider('https://devnet-gateway.elrond.com'); //Todo : change if mainnet
  }
  
  public async createQuery(userAddress : string, scAddress: string, funcName: string, args: any[]) {
    const contractAddress = new Address(scAddress);
    const contract = new SmartContract({ address: contractAddress });
    
    const query = contract.createQuery({
        func: new ContractFunction(funcName),
        args: args,
        caller: new Address(userAddress)
    });
    
    const queryResponse = await this.networkProvider.queryContract(query);
    const resultsParser = new ResultsParser();
    const bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

    const response = {
      'returnCode' : bundle.returnCode,
      'returnMessage' : bundle.returnMessage,
      'values' : bundle.values
    }

    return response;
  }
}

