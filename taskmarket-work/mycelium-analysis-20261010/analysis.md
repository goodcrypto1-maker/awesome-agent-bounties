# Mycelium Finance: diversification has two different denominators

Made by an AI agent for a Taskmarket bounty. This original analysis concerns [$MYC and Mycelium Finance](https://www.myceliumfinance.com). It uses free MCP tools only; no purchase, token transfer or paid snapshot was needed.

Mycelium Finance describes a Solana liquidity strategy that pairs its core token, $MYC, with selected ecosystem projects. $ESF is its staking token. The intended mechanism is that swaps through connected pools generate liquidity-provider fees, which can support further connections. That is a description of the strategy, not evidence that fees, reinvestment or returns occurred during this snapshot.

The allocation tool reported $35,337.81 across ten project rows at 20:52:32 UTC on 10 October 2026. Knots was the largest, at $7,419.78, or 21.00%; Parcl followed with $5,159.15, or 14.60%; Gable held $3,666.10, or 10.37%. Adding the returned dollar amounts gives 45.97% for those three and 66.26% for the largest five. Project variety therefore coexists with substantial concentration. USD Coin accounted for just $119.19, or 0.34%, so the named stablecoin row is a small share of this reported allocation.

There is an essential coverage limit: allocation returned `partial: true`. The tool does not explain the missing coverage. These shares describe the returned allocation denominator, not a proven complete balance sheet. The image makes that caveat visible. Pool liquidity in dollars also cannot be equated with the strategy operator's owned capital, redeemable holdings or revenue without information about its share of each position.

The distribution tool's separate snapshot at 20:52:35 UTC used one billion originally minted $MYC as its denominator. Trading liquidity represented 66,710,452.61 tokens (6.67%); locked LP liquidity held 144,842,294.18 (14.48%); unlocked LP liquidity held 236,007,535.25 (23.60%); time-locked token supply held 551,045,000 (55.10%); and 1,394,717.96 had been burned (0.14%). The categories reconcile to minted supply before rounding. The returned current supply, 998,605,282.04, equals minted supply less burned tokens.

The tool defines trading liquidity as the residual in holder wallets and other pools, rather than a direct measure of exchange order depth. A locked liquidity position and time-locked token supply are different restrictions: the former concerns the pool position, while the latter concerns tokens outside circulation. Conversely, unlocked LP liquidity can be rebalanced; that flexibility is not a promise of availability to ordinary holders. The distribution percentages should not be interpreted as holders' realized returns.

An additional observation comes from reading the pool labels, not just the project names. Of the reported allocation, $11,362.51 (32.15%) was attached to labels beginning MYC/, while the remaining labels began ESF/. Thus the cross-project allocation combines both token families, whereas distribution counts $MYC tokens. The two panels describe different units and universes; multiplying their percentages would invent an unsupported exposure estimate.

Finally, the top-performers tool at 20:52:39 UTC pinned ecosystem partners alongside its ranked list. Knots showed a 32.64% seven-day change, while Parcl showed -1.28% and ESF -5.80%. These returned lookbacks provide context, but neither establish the liquidity strategy's performance nor demonstrate a historical trend in allocation. This is a bounded snapshot with no price forecast or investment recommendation.

![Original chart: returned project allocation and minted MYC distribution](https://raw.githubusercontent.com/goodcrypto1-maker/awesome-agent-bounties/main/taskmarket-work/mycelium-analysis-20261010/chart.svg)

Source: Mycelium Finance MCP, get_mycelium_allocation, get_mycelium_distribution and get_solana_top_performers. Full timestamped raw tool responses accompany the Taskmarket submission. Percentages and concentration totals above are rounded or calculated from those responses.
