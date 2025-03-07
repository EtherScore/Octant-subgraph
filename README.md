# Octant Project and Protocol

## Overview

Octant is a decentralized Web3 platform designed to revolutionize the funding of public goods through innovative, community-driven mechanisms. Built on Ethereum by the Golem Foundation, Octant empowers users to participate directly in the ecosystem by locking GLM tokens, earning ETH rewards, and supporting projects that benefit the broader community.

### Key Features

- **Epoch-Based Funding:** Every 90 days, community members vote on which public goods projects receive funding, ensuring that resources are allocated in line with collective values and impact.
- **Token Locking & Rewards:** By locking a minimum amount of GLM tokens, participants earn ETH rewards based on a time-weighted system that incentivizes long-term engagement.
- **Sustainable Ecosystem:** The platform channels staking yields from significant capital reserves into a matching pool, amplifying donations and driving further impact.
- **Decentralized Governance:** Through transparent, community-led decision-making, Octant fosters decentralized governance and sustainable funding models for the growth of Web3 public goods.

This model not only strengthens the financial resilience of public projects but also creates a dynamic, incentive-aligned ecosystem where every participant has a stake in the collective future of Web3.

Check-out their latest updates and news on their official website: [Octant Build](https://octant.build/en-EN/)

## Protocol Features

- **Secure Deposits and Withdrawals**: Octant ensures that all deposit and withdrawal operations are securely executed through smart contracts. Each transaction is verified and recorded on the blockchain, preventing unauthorized access and ensuring the safety of user funds.
- **Transparency**: All transactions are recorded on the Ethereum blockchain, providing full transparency to users. This allows users to verify their transactions and ensures that all operations are conducted fairly and openly.
- **Immutability**: Once recorded, transactions cannot be altered, ensuring the integrity of the data. This immutability guarantees that the transaction history is accurate and tamper-proof.
- **User-Friendly Interface**: The protocol is designed to be user-friendly, making it easy for users to manage their digital assets. The interface provides clear and concise information about deposits, withdrawals, and account balances.
- **Integration with EtherScore**: Octant is integrated with EtherScore to provide enhanced analytics and insights. This integration allows users to access comprehensive reports and analytics, helping them make informed decisions about their digital assets.

## Protocol Functionality

### Smart Contracts

- **Core Engine:** The Octant platform is powered by Ethereum-based smart contracts that govern the locking of GLM tokens, the calculation of rewards, and the distribution of funds.
- **Non-Custodial Mechanism:** The GLM time-locking contract is non-custodial, ensuring that users retain full control over their tokens at all times.
- **Automated Reward Logic:** Smart contracts calculate user rewards using a time-weighted mechanism based on both the amount of GLM locked and the duration of the lock.

### User Accounts & Token Management

- **Account Integration:** Users interact with Octant via their Ethereum accounts. Once connected, they can lock a minimum of 100 GLM tokens to become eligible for rewards.
- **Dynamic Balance Management:** Users can adjust their locked token balance during an epoch. Note that lowering the lock amount will recalibrate the time-weighted average, impacting reward calculations.
- **Epoch-Based Interactions:** At the beginning of each 90-day epoch, users are given a two-week window to either claim their accrued rewards or donate them to public goods projects, promoting active engagement.

### Security Measures

- **Robust Contract Design:** The smart contracts have been designed with security best practices in mind, ensuring resistance to common vulnerabilities.
- **Third-Party Audits:** Rigorous security audits have been conducted on the Octant contracts to validate their integrity and safety. For detailed findings, refer to the [Security Audit Report](https://leastauthority.com) linked in the documentation.
- **User Empowerment:** With a non-custodial model, users are never required to relinquish control of their assets, significantly reducing the risk of unauthorized fund access.

### Governance

- **Decentralized Decision-Making:** Octant fosters a participatory governance model where the community helps shape the platform's evolution. Users can propose changes—ranging from eligibility criteria adjustments to new epoch themes—and vote on these proposals.
- **Transparent Processes:** Governance is supported by on-chain mechanisms and off-chain tools such as Snapshot, ensuring that decisions are made transparently and collectively.
- **Community-Driven Curation:** In addition to voting on funding allocations, community members are empowered to suggest new public goods projects for future funding rounds, reinforcing a decentralized and democratic ecosystem.

For further details, please refer to the [official Octant Documentation](https://docs.octant.app/en-EN/#key-points).

# Subgraph for Octant Protocol

## Overview

The subgraph for Octant is an essential component of the Octant integration into EtherScore. It indexes and organizes data from the Octant protocol, making it easily accessible for analysis and integration. The subgraph is built using The Graph, a decentralized protocol for indexing and querying blockchain data.

## Integration with EtherScore

The subgraph for Octant Deposits is integrated into the EtherScore project to provide comprehensive analytics and insights into user deposit and withdrawal activities. By indexing and organizing the data from the Octant protocol, the subgraph enables EtherScore to:

- **Track User Activity**: Monitor user deposits and withdrawals in real-time.
- **Analyze Trends**: Identify trends and patterns in user behavior.
- **Provide Insights**: Generate detailed reports and insights for users and stakeholders.
- **Enhance Transparency**: Ensure transparency and accountability in the protocol's operations.

The integration of the subgraph into EtherScore enhances the overall functionality and value of the project, providing users with a powerful tool for managing and analyzing their digital assets.

## Setup and Deployment

## Dependencies

The project requires specific dependencies to build, compile, and deploy the subgraph. These dependencies are defined in the `package.json` file.
Run `npm install` command in your terminal to make sure that everything is setup correctly

- **@graphprotocol/graph-cli**: This is the command-line tool for managing subgraphs. It is used for building, deploying, and interacting with subgraphs.
  - **Version**: `0.79.0`
- **@graphprotocol/graph-ts**: This library provides TypeScript bindings for The Graph's subgraph mappings. It is used to write the mapping logic in TypeScript.
  - **Version**: `0.32.0`

### Dev Dependencies

- **matchstick-as**: This is a testing framework for AssemblyScript, used to write and run tests for the subgraph mappings.
  - **Version**: `0.5.0`

These dependencies ensure that the subgraph is correctly built, tested, and deployed, providing a robust and reliable integration with The Graph protocol.

## Compilation and Deployment

The following scripts from the package.json file are defined to help with the build, code generation, compilation, and deployment of the subgraph. These scripts are essential for managing the subgraph's lifecycle and ensuring that it is correctly built and deployed.

### Build Script

- **Command**: `graph build`
- **Description**: This script compiles the subgraph's GraphQL schema and mappings. It ensures that the subgraph is correctly built and ready for deployment.
- **Usage**: Run `npm run build` to compile the subgraph.

### Codegen Script

- **Command**: `graph codegen`
- **Description**: This script generates the necessary TypeScript types and classes based on the subgraph's GraphQL schema.
- **Usage**: Run `npm run codegen` to generate the TypeScript code and apply the fix.

### Compile Script

- **Command**: `graph build && graph codegen`
- **Description**: This script combines the build and codegen steps into a single command. It first compiles the subgraph and then generates the TypeScript code
- **Usage**: Run `npm run compile` to build and generate the subgraph in one step.

### Deploy Script

- **Command**: `graph deploy subgraph-name`
- **Description**: This script deploys the subgraph to The Graph's hosted service or a decentralized network. Replace `subgraph-name` with the actual name of your subgraph.
- **Usage**: Run `npm run deploy subgraph-name` to deploy the subgraph. Ensure that you have configured your deployment settings and have the necessary permissions.

## Schema

The schema defines the structure of the data indexed by the subgraph. It includes the following entities: `OctantEvent`, `User`, `CumulativeDailyStat` and `DailyMetrics`

## Subgraph Configuration

The subgraph is configured in the `subgraph.yaml` file. This file specifies the data sources, entities, and event handlers used to index the data.

### Data Sources

- **OctantDeposits**: The main data source for the subgraph.
  - `address`: The address of the OctantDeposits contract, visible on Etherscan here: [https://etherscan.io/address/0x879133Fd79b7F48CE1c368b0fCA9ea168eaF117c]()
  - `abi`: The ABI of the OctantDeposits contract.
  - `startBlock`: The block number to start indexing from.

## Subgraph Statistics

The subgraph also includes statistics to provide insights into the daily activities on the Octant protocol. These statistics are provided by the following entities: `CumulativeDailyStat` and `DailyMetrics`

These entities enable the subgraph to provide detailed cumulative and day to day statistics, helping users and stakeholders to monitor and analyze the protocol's performance over time. Read the [entity section](#entities) below for more details.

### Mapping

The mapping defines how events from the OctantDeposits contract are handled and indexed.

- **Entities**: The entities to be indexed (`Locked`, `Unlocked`, `User`).
- **ABIs**: The ABI files used to decode the contract events.
- **Event Handlers**: The event handlers that process the contract events.
  - `Locked(uint256,uint256,uint256,address)`: Handled by `handleLocked`.
  - `Unlocked(uint256,uint256,uint256,address)`: Handled by `handleUnlocked`.

### Entities

- **OctantEvent**: Represents an event on Octant.
  - `id`: Unique identifier for the event.
  - `type`: Type of the event (0 for Lock, 1 for Unlock).
  - `depositBeforeLock`: Total deposit amount before the lock event.
  - `amountLock`: Current deposit amount for the lock event.
  - `whenLock`: Date of the lock event.
  - `user`: User entity that made the event.
  - `depositBeforeUnlock`: Total deposit amount before the unlock event.
  - `amountUnlock`: Current withdrawal amount for the unlock event.
  - `whenUnlock`: Date of the unlock event.
  - `blockNumber`: Block number of the event.
  - `blockTimestamp`: Timestamp of the block.
  - `transactionHash`: Transaction hash of the event.
  - `timestamp`: Timestamp for aggregation.

#### Query Example in the Graph Studio

To query the `OctantEvent` entity in The Graph Studio, you can use the following GraphQL query.

This query retrieves the first 5 `OctantEvent` events, including details such as the unique identifier, event type, deposit amounts, dates, user information, block number, timestamp, and transaction hash.

```graphql
{
  octantEvents(first: 5) {
    id
    type
    depositBeforeLock
    amountLock
    whenLock
    user {
      id
    }
    depositBeforeUnlock
    amountUnlock
    whenUnlock
    blockNumber
    blockTimestamp
    transactionHash
    timestamp
  }
}
```

- **CumulativeDailyStat**: Represents the cumulative statistics of the protocol up to a specific timestamp.
  - `id`: Unique identifier for the cumulative data.
  - `date`: The readable date of the cumulate statistics for this day
  - `timestamp`: The timestamp up to which the data is aggregated.
  - `isAdded`: Boolean flag indicating if the data has been added.
  - `CumulativeDepositAmount`: Total deposited amount up to the selected timestamp.
  - `CumulativeWithdrawAmount`: Total withdrawn amount up to the selected timestamp.
  - `CurrentTotalGLMStaked`: Current total amount of GLM staked.
  - `TotalUsers`: Total number of users who have interacted with the protocol.
  - `CurrentTotalUsers`: Current total number of active users with a positive balance of locked GLM tokens.
  - `AverageDailyDeposits`: Average daily deposit count up to the selected timestamp.
  - `AverageDailyGLMDeposits`: Average daily GLM deposit amount up to the selected timestamp.
  - `AverageDailyWithdrawals`: Average daily withdrawal count up to the selected timestamp.
  - `AverageDailyGLMWithdrawals`: Average daily GLM withdrawal amount up to the selected timestamp.
  - `AverageDailyUsers`: Average daily user count up to the selected timestamp.

#### Query Example in the Graph Studio

To query the `CumulativeDailyStat` entity in The Graph Studio, you can use the following GraphQL query.

This query retrieves the cumulative sorted by ascending id, including details such as the day ID, timestamp, cumulative deposit and withdrawal amounts, current total GLM staked, total users and current total users.

```graphql
{
  CumulativeDailyStats(orderBy: id, orderDirection: asc) {
    id
    date
    timestamp
    TotalUsers
    CurrentTotalUsers
    CumulativeDepositAmount
    CumulativeWithdrawAmount
    CurrentTotalGLMStaked
  }
}
```

Here is another query but for the AverageMetrics:

```graphql
{
  CumulativeDailyStats(orderBy: id, orderDirection: asc) {
    id
    date
    timestamp
    TotalUsers
    AverageDailyDeposits
    AverageDailyGLMDeposits
    AverageDailyWithdrawals
    AverageDailyGLMWithdrawals
    AverageDailyUsers
  }
}
```

#### Daily time series

**DailyMetrics**:
  The `DailyMetrics` entity aggregates daily statistics for `OctantEvent` entities. It provides a summary of deposit and withdrawal activities on a daily basis.

Fields:

- `id`: Unique identifier for the daily statistics record.
- `timestamp`: The timestamp for the day being aggregated.
- `DailyDepositCount`: The number of deposit events that occurred on the selected day.
- `DailyDepositAmount`: The total amount of GLM deposited on the selected day.
- `DailyWithdrawCount`: The number of withdrawal events that occurred on the selected day.
- `DailyWithdrawAmount`: The total amount of GLM withdrawn on the selected day.

#### Query Example in the Graph Studio

Retrieves daily statistics with all possible metrics and associated timestamp.

```graphql
{
  dailyMetrics_collection(interval: day) {
    DailyDepositCount
    DailyDepositGLMCount
    DailyUsersCount
    DailyWithdrawCount
    DailyWithdrawGLMCount
    timestamp
  }
}
```
