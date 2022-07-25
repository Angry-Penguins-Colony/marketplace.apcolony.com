# 🔄 Server Push Render


## Description

Periodically, get the queue of images to render from the customization SC. 
For each them:

1. render it (with the `package-renderer`)
2. pin it on the IPFS on Pinata Cloud
3. send it CID to the customization SC.

## How to host it ?

Angry Penguins Colony uses [Heroku](https://www.heroku.com/) to host the server.

## How to setup it up ?

- Install a forked and configured package of [package-renderer](https://github.com/Angry-Penguins-Colony/package-renderer) like so: 
```
npm i git+ssh://git@github.com:{YourGitName}/{RepoName}.git
```

- Configure `src/config.ts`

```typescript
const config: IConfig = {
    // time to wait after processing the queue
    msBetweenUpdate: 500, 

    // the gateway
    gatewayUrl: "https://devnet-gateway.elrond.com", 

    // the customisation smart contract address
    customisationContract: new Address("erd1qqqqqqqqqqqqqpgq4cc5y02uglu0fu2v7vkrnctc89jn2pgzsdvspx4u4x"), 

    // Call claim endpoint on smart contract when server's balance is lesser than this thresold
    claimThreshold: new BigNumber("1e18"), // 1 EGLD
};
```

> **💡 WHY IS THERE A CLAIM THRESHOLD ?**
>
> The server spend EGLD on gas fees for each `setCidOf` transactions. And so, the wallet could be empty.
> Hopefully, when the balance is lesser than the claim thresold, the server will get the smart contract's balance.

- Create a `.env` file

```rust
// .pem content of the contract owner; used to send setCidOf and claim transaction
SENDER_PEM="-----BEGIN PRIVATE KEY for erd1pg0mruhqdggrad3mjh7xe9e9wrxt8vtuehz08tzww8v6cmftsdvs9d2gh8-----
MY PRIVATE KEY
-----END PRIVATE KEY for erd1pg0mruhqdggrad3mjh7xe9e9wrxt8vtuehz08tzww8v6cmftsdvs9d2gh8-----"
// address of the sender
SENDER_BECH32="erd1pg0mruhqdggrad3mjh7xe9e9wrxt8vtuehz08tzww8v6cmftsdvs9d2gh8"

PINATA_API_KEY="some-key"
PINATA_API_SECRET="some-secret"

// this is optional; I used this values for testing scripts like npm run send:renderImage
SENDER_TEST_PEM="-----BEGIN PRIVATE KEY for erd107rsf7engp63phyrt33v6vtqgqrs0rckd3r53fpch9qlg97g60cqmz5t29
MY PRIVATE KEY
-----END PRIVATE KEY for erd107rsf7engp63phyrt33v6vtqgqrs0rckd3r53fpch9qlg97g60cqmz5t29-----"
SENDER_TEST_BECH32="erd107rsf7engp63phyrt33v6vtqgqrs0rckd3r53fpch9qlg97g60cqmz5t29"
```

