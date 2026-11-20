---
name: tencent-cpdp
description: Tencent Cloud CPDP via the Tencent MCP server — 219 actions in API version v20190820 (103 read-only auto-allowed). Use for bank, order, open, merchant, flex, payment. Triggers on mentions of cpdp, bank, order, open, merchant, flex, payment, acct, bind. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Payments & funds
metadata:
  version: "4"
---

# Tencent Cloud CPDP

Payments & funds: 219 actions in API version `v20190820` — 103 read-only (auto-allowed), 107 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cpdp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Payment calls move real money — confirm amount, currency, payer/payee, and order ID with the user before every mutating call, and verify ledger state afterwards.
Idempotency keys/order numbers prevent duplicate charges on retry — always pass them; never blindly retry a timed-out payment without checking state first.
Refunds and settlements are separate actions from payment — follow the full lifecycle, and reconcile against statements.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cpdp/v20190820 — action signatures in `cpdp_client.ts`, full request/response shapes in `cpdp_models.ts`.

## Read actions (auto-allowed, 103)

| Action | What it does |
|---|---|
| `QueryAssignment` | Query assignment<br>Required: `AnchorId` |
| `QueryFlexFreezeOrderList` | Query flex freeze order list<br>Required: `PayeeId`, `OperationType`, `StartTime`, `EndTime`, `PageNumber` |
| `QueryMemberTransactionDetails` | Query member transaction details<br>Required: `QueryDateType`, `QueryTranType`, `BankAccountNumber`, `SubAccountNumber`, `PageOffSet` |
| `QueryOrder` | Query order<br>Required: `MidasAppId`, `UserId`, `Type`, `MidasSecretId`, `MidasSignature` |
| `QueryOpenBankRefundOrder` | Query open bank refund order<br>Required: `ChannelMerchantId` |
| `QueryOpenBankVerificationOrder` | Query open bank verification order<br>Required: `ChannelMerchantId` |
| `QueryCloudOrder` | Query cloud order<br>Required: `MidasAppId`, `UserId`, `Type` |
| `GetPayRollAuthResult` | Get pay roll auth result<br>Required: `AuthNumber`, `SubMerchantId` |
| `QueryBankTransactionDetails` | Query bank transaction details<br>Required: `MrchCode`, `FunctionFlag`, `SubAcctNo`, `QueryFlag`, `PageNum` |
| `QueryFlexServiceProviderAccountBalance` | Query flex service provider account balance<br>Required: `ServiceProviderId` |
| `QueryCommonTransferRecharge` | Query common transfer recharge<br>Required: `MrchCode`, `FunctionFlag`, `StartDate` (format `20190101…`), `EndDate` (format `20190101…`), `PageNum` |
| `DownloadBill` | Download bill<br>Required: `StateDate`, `MidasAppId`, `MidasSecretId`, `MidasSignature` |
| `QueryCustAcctIdBalance` | Query cust acct id balance<br>Required: `MrchCode`, `QueryFlag`, `PageNum` |
| `QueryAnchorContractInfo` | Query anchor contract info<br>Required: `BeginTime` (format `yyyy-MM-dd…`), `EndTime` (format `yyyy-MM-dd…`) |
| `QueryMerchantPayWayList` | Query merchant pay way list<br>Required: `OpenId`, `OpenKey`, `PayType` |
| `QueryOpenBankSubMerchantRateConfigure` | Query open bank sub merchant rate configure<br>Required: `ChannelRegistrationNo`, `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName` |
| `QueryTrade` | Query trade<br>Required: `TradeFileId` |
| `QueryFlexPayeeAccountList` | Query flex payee account list<br>Required: `PropertyInfo` |
| `QueryOpenBankExternalSubAccountBookBalance` | Query open bank external sub account book balance<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod` |
| `QueryMerchantClassification` | Query merchant classification<br>Required: `OpenId`, `OpenKey` |
| `QueryFlexSettlementOrderList` | Query flex settlement order list<br>Required: `PayeeId`, `StartTime`, `EndTime`, `PageNumber` |
| `QueryInvoice` | Query invoice<br>Required: `InvoicePlatformId`, `OrderId` |
| `QueryFlexPayeeInfo` | Query flex payee info |
| `QueryTransferDetail` | Query transfer detail<br>Required: `MerchantId` |
| `QueryOpenBankBankBranchList` | Query open bank bank branch list<br>Required: `ChannelMerchantId`, `ChannelName`, `PaymentMethod`, `BankBranchName`, `BankAbbreviation`, `PageNumber` |
| `QueryExchangeRate` | Query exchange rate<br>Required: `SourceCurrency` (default CNY) |
| `QuerySinglePaymentResult` | Query single payment result<br>Required: `TransferType` |
| `QueryFlexPaymentOrderList` | Query flex payment order list<br>Required: `StartTime`, `EndTime`, `PageNumber` |
| `QueryOpenBankSupportBankList` | Query open bank support bank list<br>Required: `ChannelMerchantId`, `ChannelName`, `PaymentMethod` |
| `QueryFlexOrderSummaryList` | Query flex order summary list<br>Required: `SummaryDate`, `PageNumber`, `OrderType` |
| `QueryMerchantBalance` | Query merchant balance<br>Required: `Currency` |
| `QueryContractPayWayList` | Query contract pay way list<br>Required: `OpenId`, `OpenKey` |
| `QueryOpenBankSettleOrder` | Query open bank settle order<br>Required: `ChannelMerchantId` |
| `QueryBatchPaymentResult` | Query batch payment result<br>Required: `BatchId` |
| `GetPayRollAuthList` | Get pay roll auth list<br>Required: `OpenId`, `SubMerchantId`, `AuthDate` (format `YYYY-MM-DD…`), `Offset`, `Limit` (default 10) |
| `QueryFlexPayeeAccountInfo` | Query flex payee account info |
| `QueryMemberBind` | Query member bind<br>Required: `MrchCode`, `QueryFlag`, `PageNum` |
| `QueryOpenBankUnbindExternalSubMerchantBankAccount` | Query open bank unbind external sub merchant bank account<br>Required: `ChannelSubMerchantId`, `ChannelMerchantId` |
| `QueryContractRelateShop` | Query contract relate shop<br>Required: `OpenId`, `OpenKey`, `ContractId` |
| `CheckAmount` | Check amount<br>Required: `MrchCode`, `TranNetMemberCode`, `TakeCashAcctNo`, `AuthAmt`, `Ccy` (default RMB) |
| `QueryTransferResult` | Query transfer result<br>Required: `MerchantId`, `MerchantAppId`, `TransferType` |
| `QueryOutwardOrder` | Query outward order<br>Required: `TransactionId` |
| `QueryShopOpenId` | Query shop open id<br>Required: `OpenId`, `OpenKey`, `ShopNo` |
| `QueryFinancialDataUrl` | Query financial data url<br>Required: `EndTime`, `StartTime`, `DataType` |
| `QueryMaliciousRegistration` | Query malicious registration<br>Required: `MerchantId`, `MerchantName`, `CompanyName`, `RegAddress`, `RegTime` |
| `QueryOpenBankSubMerchantCredential` | Query open bank sub merchant credential<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName` |
| `QueryFlexPaymentOrderStatus` | Query flex payment order status |
| `QueryFlexPlatformAccountBalance` | Query flex platform account balance<br>Required: `IncomeType` |
| `QueryFlexAmountBeforeTax` | Query flex amount before tax<br>Required: `PayeeId`, `IncomeType`, `AmountAfterTax` |
| `QueryAcctInfo` | Query acct info<br>Required: `MidasAppId`, `SubMchId`, `MidasSecretId`, `MidasSignature` |
| `QueryReconciliationFileApplyInfo` | Query reconciliation file apply info<br>Required: `ApplyFileId` |
| `QueryBankWithdrawCashDetails` | Query bank withdraw cash details<br>Required: `MrchCode`, `FunctionFlag`, `SubAcctNo`, `QueryFlag`, `PageNum` |
| `QueryOpenBankBillDataPage` | Query open bank bill data page<br>Required: `ChannelMerchantId`, `BillDate`, `ChannelName`, `PageNo`, `PageSize` |
| `QueryDownloadBillURL` | Query download bill url<br>Required: `MerchantAppId`, `ChannelCode`, `BillDate` |
| `CheckAcct` | Check acct<br>Required: `MidasAppId`, `SubAppId`, `BindType`, `SettleAcctNo`, `MidasSecretId`, `MidasSignature` |
| `QueryMerchantOrder` | Query merchant order<br>Required: `MerchantAppId`, `OrderNo` |
| `QueryFlexWechatAuthResult` | Query flex wechat auth result<br>Required: `AuthNo` |
| `QueryInvoiceV2` | Query invoice v2<br>Required: `InvoicePlatformId`, `OrderId` |
| `QueryMerchant` | Query merchant<br>Required: `MerchantAppId` |
| `QueryBalance` | Query balance<br>Required: `MidasAppId`, `SubAppId`, `QueryFlag`, `PageOffset`, `MidasSecretId`, `MidasSignature` |
| `QueryCloudRefundOrder` | Query cloud refund order<br>Required: `MidasAppId`, `UserId`, `RefundId` |
| `DownloadOrgFile` | Download org file<br>Required: `OpenId`, `OpenKey` |
| `GetBillDownloadUrl` | Get bill download url<br>Required: `OpenId`, `OpenKey`, `Day` |
| `QueryAgentTaxPaymentBatch` | Query agent tax payment batch<br>Required: `BatchNum` |
| `DescribeOrderStatus` | Describe order status<br>Required: `RequestType`, `MerchantCode`, `PayChannel`, `PayChannelSubId`, `OrderId`, `BankAccountNumber`, `PlatformShortNumber`, `QueryType`, `TransSequenceNumber`, `MidasSignature`, `MidasAppId`, `MidasSecretId`, `MidasEnvironment` |
| `QueryAcctBinding` | Query acct binding<br>Required: `MidasAppId`, `SubAppId`, `MidasSecretId`, `MidasSignature` |
| `QueryFundsTransactionDetails` | Query funds transaction details<br>Required: `QueryDateType`, `QueryTranType`, `BankAccountNumber`, `SubAccountNumber`, `PageOffSet` |
| `QueryOpenBankPaymentOrder` | Query open bank payment order<br>Required: `ChannelMerchantId`, `OutOrderId`, `ChannelOrderId` |
| `QueryBankClear` | Query bank clear<br>Required: `MrchCode`, `FunctionFlag`, `PageNum` |
| `QueryCloudChannelData` | Query cloud channel data<br>Required: `MidasAppId`, `OutOrderNo`, `ExternalChannelDataType` |
| `QueryCityCode` | Query city code<br>Required: `OpenId`, `OpenKey` |
| `QueryApplicationMaterial` | Query application material<br>Required: `DeclareId` |
| `QueryFlexPayeeAccountBalance` | Query flex payee account balance<br>Required: `PayeeId`, `IncomeType` |
| `QueryFlexBillDownloadUrl` | Query flex bill download url<br>Required: `BillDate`, `BillType` |
| `QueryOpenBankDownLoadUrl` | Query open bank down load url<br>Required: `ChannelMerchantId`, `BillDate` |
| `QueryOrderStatus` | Query order status<br>Required: `OpenId`, `OpenKey`, `DeveloperNo` |
| `QueryPayerInfo` | Query payer info<br>Required: `PayerId` |
| `QueryCompanyTitle` | Query company title<br>Required: `CompanyTitleKeyword`, `InvoicePlatformId`, `SellerTaxpayerNum` |
| `DescribeChargeDetail` | Describe charge detail<br>Required: `RequestType`, `MerchantCode`, `PayChannel`, `PayChannelSubId`, `OrderId`, `BankAccountNumber`, `AcquiringChannelType`, `PlatformShortNumber`, `MidasSecretId`, `MidasAppId`, `MidasSignature`, `TransSequenceNumber`, `MidasEnvironment` |
| `GetPayRollAuth` | Get pay roll auth<br>Required: `OpenId`, `SubMerchantId` |
| `GetDistributeBillDownloadUrl` | Get distribute bill download url<br>Required: `OpenId`, `OpenKey`, `Day` |
| `QueryMerchantInfoForManagement` | Query merchant info for management<br>Required: `InvoicePlatformId`, `Offset`, `Limit` |
| `QueryOpenBankDailyReceiptDownloadUrl` | Query open bank daily receipt download url<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod`, `BindSerialNo`, `QueryDate` |
| `DownloadReconciliationUrl` | Download reconciliation url<br>Required: `MainAppId`, `AppCode`, `BillDate` |
| `QueryMemberTransaction` | Query member transaction<br>Required: `MrchCode`, `FunctionFlag`, `OutSubAcctNo`, `OutMemberCode`, `OutSubAcctName`, `InSubAcctNo`, `InMemberCode`, `InSubAcctName`, `TranAmt`, `TranFee`, `TranType`, `Ccy` (default RMB) |
| `QueryOpenBankProfitSharePayee` | Query open bank profit share payee<br>Required: `ChannelMerchantId` |
| `QueryBillDownloadURL` | Query bill download url<br>Required: `MerchantId`, `TransferType`, `BillDate` |
| `QueryOpenBankOrderDetailReceiptInfo` | Query open bank order detail receipt info<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod` |
| `QueryRefund` | Query refund<br>Required: `UserId`, `RefundId`, `MidasAppId`, `MidasSecretId`, `MidasSignature` |
| `QueryOpenBankSubMerchantSignOnline` | Query open bank sub merchant sign online<br>Required: `ChannelMerchantId`, `ChannelName` |
| `QueryOpenBankExternalSubMerchantBankAccount` | Query open bank external sub merchant bank account<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod` |
| `QueryAgentStatements` | Query agent statements<br>Required: `Date`, `Type` |
| `QueryContract` | Query contract<br>Required: `MidasAppId`, `UserId`, `Channel`, `ContractQueryMode`, `MidasSignature`, `MidasSecretId` |
| `QueryOpenBankExternalSubMerchantRegistration` | Query open bank external sub merchant registration<br>Required: `ChannelMerchantId` |
| `QueryContractPayFee` | Query contract pay fee<br>Required: `OpenId`, `OpenKey`, `PaymentId` |
| `QuerySmallAmountTransfer` | Query small amount transfer<br>Required: `MrchCode`, `OldTranSeqNo`, `TranDate` (format `20190101…`) |
| `QueryOpenBankBindExternalSubMerchantBankAccount` | Query open bank bind external sub merchant bank account<br>Required: `ChannelSubMerchantId`, `ChannelMerchantId` |
| `QuerySingleTransactionStatus` | Query single transaction status<br>Required: `MrchCode`, `FunctionFlag`, `TranNetSeqNo` |
| `QueryTransferBatch` | Query transfer batch<br>Required: `MerchantId`, `NeedQueryDetail` |
| `QueryOpenBankBankAccountBalance` | Query open bank bank account balance<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod`, `BindSerialNo` |
| `QueryAcctInfoList` | Query acct info list<br>Required: `MidasAppId`, `QueryAcctBeginTime`, `QueryAcctEndTime`, `PageOffset`, `MidasSecretId`, `MidasSignature` |
| `QueryReconciliationDocument` | Query reconciliation document<br>Required: `MrchCode`, `FileType`, `FileDate` (format `20190101…`) |
| `QueryExceedingInfo` | Query exceeding info<br>Required: `TimeStr` (format `yyyy-MM-dd…`) |
## Mutations (gated — need allowlist, 107)

| Action | What it does |
|---|---|
| `DistributeAccreditQuery` | Distribute accredit query<br>Required: `OpenId`, `OpenKey` |
| `AddFlexPhoneNo` | Add flex phone no<br>Required: `PhoneNo`, `PayeeId` |
| `CreateBatchPayment` | Create batch payment<br>Required: `TransferType`, `RecipientList` |
| `DeduceQuota` | Run deduce quota<br>Required: `AnchorId`, `Amount`, `OrderId` |
| `CreateExternalAnchor` | Create external anchor<br>Required: `Uid`, `Name`, `IdNo` |
| `WithdrawCashMembership` | Run withdraw cash membership<br>Required: `MrchCode`, `TranWebName`, `MemberGlobalType`, `MemberGlobalId`, `TranNetMemberCode`, `MemberName`, `TakeCashAcctNo`, `OutAmtAcctName`, `Ccy` (default RMB), `CashAmt` |
| `CreateOpenBankExternalSubMerchantRegistration` | Create open bank external sub merchant registration<br>Required: `OutRegistrationNo`, `ChannelMerchantId`, `OutSubMerchantId`, `ChannelName`, `PaymentMethod`, `BusinessLicenseNumber`, `OutSubMerchantName` |
| `ApplyFlexPayment` | Run apply flex payment<br>Required: `PayeeId`, `IncomeType`, `AmountBeforeTax`, `OutOrderId`, `FundingAccountInfo` |
| `ViewContract` | View contract<br>Required: `OpenId`, `OpenKey` |
| `CreateOpenBankUnifiedOrder` | Create open bank unified order<br>Required: `ChannelMerchantId`, `ChannelName`, `PayType`, `OutOrderId`, `TotalAmount`, `Currency` |
| `TransferSinglePay` | Transfer single pay<br>Required: `MerchantId`, `MerchantAppId`, `TransferType`, `OrderId`, `TransferAmount`, `PayeeId` |
| `RegisterBillSupportWithdraw` | Register bill support withdraw<br>Required: `TranNetMemberCode`, `OrderNo`, `SuspendAmt`, `TranFee` (default 0.0), `MrchCode` |
| `AddFlexIdInfo` | Add flex id info<br>Required: `IdType`, `IdNo`, `PayeeId` |
| `CreateOpenBankRechargeOrder` | Create open bank recharge order<br>Required: `ChannelMerchantId`, `OutOrderId`, `TotalAmount`, `Currency`, `ExpireTime`, `ChannelName`, `PaymentMethod`, `PayeeInfo`, `ChannelSubMerchantId` |
| `FreezeFlexBalance` | Freeze flex balance<br>Required: `PayeeId`, `AmountBeforeTax`, `IncomeType`, `OutOrderId`, `OperationType` |
| `AddShop` | Add shop<br>Required: `OpenId`, `OpenKey`, `OutShopId`, `ShopName`, `ShopFullName`, `MerchantNo`, `Telephone`, `OpenHours`, `CityId`, `Address`, `PictureOne`, `PictureTwo`, `PictureThree` |
| `ApplyApplicationMaterial` | Run apply application material<br>Required: `TransactionId`, `DeclareId`, `PayerId`, `SourceCurrency`, `TargetCurrency`, `TradeCode` |
| `CreateTransferBatch` | Create transfer batch<br>Required: `MerchantId`, `TransferDetails`, `MerchantAppId`, `MerchantBatchNo`, `BatchName`, `BatchRemark`, `TotalAmount`, `TotalNum` |
| `CreateInvoiceV2` | Create invoice v2<br>Required: `InvoicePlatformId`, `TitleType`, `BuyerTitle`, `OrderId`, `AmountHasTax`, `TaxAmount`, `AmountWithoutTax` (default 1), `SellerTaxpayerNum` |
| `BindOpenBankProfitSharePayee` | Bind open bank profit share payee<br>Required: `ChannelMerchantId`, `AccountNo`, `ChannelName` |
| `UnbindRelateAcct` | Unbind relate acct<br>Required: `MrchCode`, `FunctionFlag`, `TranNetMemberCode`, `MemberAcctNo` |
| `ContractOrder` | Run contract order<br>Required: `CurrencyType`, `MidasAppId`, `OutTradeNo`, `ProductDetail`, `ProductId`, `ProductName`, `TotalAmt`, `UserId`, `RealChannel`, `OriginalAmt`, `MidasSecretId`, `MidasSignature`, `ContractNotifyUrl` |
| `ApplyOpenBankOrderDetailReceipt` | Run apply open bank order detail receipt<br>Required: `OutApplyId`, `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod`, `ChannelOrderId` |
| `RegisterBehavior` | Register behavior<br>Required: `MidasAppId`, `SubAppId`, `MidasSecretId`, `MidasSignature`, `FunctionFlag` |
| `ViewMerchant` | View merchant<br>Required: `OpenId`, `OpenKey` |
| `UploadTaxPayment` | Upload tax payment<br>Required: `Channel`, `TaxId`, `FileUrl` |
| `CreatePayRollPreOrderWithAuth` | Create pay roll pre order with auth<br>Required: `OpenId`, `SubMerchantId`, `AuthNumber`, `ProjectName`, `CompanyName`, `UserName`, `IdNo`, `EmploymentType` |
| `CreateOpenBankPaymentOrder` | Create open bank payment order<br>Required: `ChannelMerchantId`, `ChannelName`, `PaymentMethod`, `PaymentMode`, `OutOrderId`, `TotalAmount`, `Currency`, `PayerInfo`, `PayeeInfo` |
| `RefundTlinxOrder` | Refund tlinx order<br>Required: `OpenId`, `OpenKey`, `DeveloperNo`, `RefundOutNo`, `RefundOrderName`, `RefundAmount`, `ShopPassword` (default 123456) |
| `UnBindAcct` | Run un bind acct<br>Required: `MidasAppId`, `SubAppId`, `SettleAcctNo`, `MidasSecretId`, `MidasSignature` |
| `DistributeApply` | Distribute apply<br>Required: `OpenId`, `OpenKey`, `OutDistributeNo`, `Details` |
| `CreatePayRollPreOrder` | Create pay roll pre order<br>Required: `OpenId`, `SubMerchantId`, `AuthNumber`, `ProjectName`, `CompanyName` |
| `CreateOpenBankGlobalPaymentOrder` | Create open bank global payment order<br>Required: `ChannelMerchantId`, `ChannelName`, `PayType`, `OutOrderId`, `TotalAmount`, `Currency` |
| `AddContract` | Add contract<br>Required: `OpenId`, `OpenKey`, `OutContractId`, `Code`, `PaymentId`, `PaymentClassificationId`, `PaymentClassificationLimit`, `MerchantNo`, `Fee`, `StartDate`, `EndDate`, `SignMan`, `SignName`, `SignDate`, `AutoSign`, `Contact`, `ContactTelephone`, `PictureOne` |
| `CreateCloudSubMerchant` | Create cloud sub merchant<br>Required: `MidasAppId`, `ParentAppId`, `SubMchName`, `SubMchDescription` |
| `CreateAgentTaxPaymentInfos` | Create agent tax payment infos<br>Required: `AgentId`, `Channel`, `Type`, `RawElectronicCertUrl`, `FileName`, `AgentTaxPaymentInfos` |
| `CreatePayMerchant` | Create pay merchant<br>Required: `PlatformCode`, `ChannelMerchantNo`, `ChannelCheckFlag`, `MerchantName` |
| `RefundOpenBankOrder` | Refund open bank order<br>Required: `OutRefundId`, `RefundAmount` |
| `CreatePayRollToken` | Create pay roll token<br>Required: `OpenId`, `SubMerchantId`, `UserName`, `IdNo`, `EmploymentType` |
| `UploadExternalAnchorInfo` | Upload external anchor info<br>Required: `AnchorId` |
| `ApplyOpenBankSubMerchantSignOnline` | Run apply open bank sub merchant sign online<br>Required: `ChannelMerchantId`, `ChannelName` |
| `UnifiedOrder` | Run unified order<br>Required: `CurrencyType`, `MidasAppId`, `OutTradeNo`, `ProductDetail`, `ProductId`, `ProductName`, `TotalAmt`, `UserId`, `RealChannel`, `OriginalAmt`, `MidasSecretId`, `MidasSignature` |
| `ConfirmOrder` | Confirm order<br>Required: `MerchantAppId`, `OrderNo` |
| `ViewShop` | View shop<br>Required: `OpenId`, `OpenKey` |
| `CreateAnchor` | Create anchor<br>Required: `AnchorUid`, `AnchorName`, `AnchorPhone`, `AnchorEmail`, `AnchorAddress`, `AnchorIdNo`, `AnchorType` |
| `MigrateOrderRefund` | Migrate order refund<br>Required: `MerchantId`, `PayChannel`, `PayOrderId`, `RefundOrderId`, `RefundAmt`, `ThirdChannelOrderId` |
| `ApplyReconciliationFile` | Run apply reconciliation file<br>Required: `ApplyFileType`, `ApplyFileDate` (format `yyyyMMdd…`), `BankAccountNumber` |
| `BindAccount` | Bind account<br>Required: `AnchorId`, `TransferType`, `AccountNo`, `PhoneNum` |
| `VerifyOpenBankAccount` | Verify open bank account<br>Required: `ChannelMerchantId`, `ChannelName`, `PayeeInfo` |
| `CreateFlexPayee` | Create flex payee<br>Required: `OutUserId`, `Name`, `IdNo`, `AccountName`, `ServiceProviderId`, `TaxInfo`, `IdType` |
| `CreateRedInvoiceV2` | Create red invoice v2<br>Required: `InvoicePlatformId`, `OrderId` |
| `SyncContractData` | Sync contract data<br>Required: `MidasAppId`, `UserId`, `Channel`, `OutContractCode`, `ContractStatus`, `ContractSyncInfo`, `MidasSignature`, `MidasSecretId` |
| `UploadTaxList` | Upload tax list<br>Required: `Channel`, `BeginMonth`, `EndMonth`, `FileUrl` |
| `BindAcct` | Bind acct<br>Required: `MidasAppId`, `SubAppId`, `BindType`, `SettleAcctNo`, `SettleAcctName`, `SettleAcctType`, `IdType`, `IdCode`, `AcctBranchName`, `MidasSecretId`, `MidasSignature` |
| `BindRelateAcctSmallAmount` | Bind relate acct small amount<br>Required: `MrchCode`, `TranNetMemberCode`, `MemberName`, `MemberGlobalType`, `MemberGlobalId`, `MemberAcctNo`, `BankType`, `AcctOpenBranchName`, `Mobile` |
| `CreateOrder` | Create order<br>Required: `ChannelCode`, `MerchantAppId`, `Amount`, `TraceNo`, `NotifyUrl`, `ReturnUrl` |
| `UnifiedTlinxOrder` | Run unified tlinx order<br>Required: `OpenId`, `OpenKey`, `DeveloperNo`, `PayTag`, `TradeAmount`, `NotifyUrl` |
| `UploadOrgFile` | Upload org file<br>Required: `OpenId`, `OpenKey`, `Storage`, `FileMd5`, `FileContent`, `FileExtension` |
| `BindRelateAccReUnionPay` | Bind relate acc re union pay<br>Required: `MrchCode`, `TranNetMemberCode`, `MemberAcctNo`, `MessageCheckCode` |
| `ApplyFlexWechatPreAuth` | Run apply flex wechat pre auth<br>Required: `AuthNo`, `OpenId`, `ProjectName`, `EmployerName`, `UserName`, `IdNo`, `EmploymentType`, `AuthType`, `Environment` |
| `ReviseMbrProperty` | Run revise mbr property<br>Required: `MrchCode`, `SubAcctNo`, `MemberProperty` |
| `BindOpenBankExternalSubMerchantBankAccount` | Bind open bank external sub merchant bank account<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod`, `ExternalSubMerchantBindBankAccountData`, `OutApplyId` |
| `RevokeRechargeByThirdPay` | Revoke recharge by third pay<br>Required: `RequestType`, `MerchantCode`, `PayChannel`, `PayChannelSubId`, `OrderId`, `BankAccountNumber`, `PlatformShortNumber`, `MidasSecretId`, `MidasAppId`, `MidasSignature`, `TransSequenceNumber`, `TransFee`, `ThirdPayChannel`, `ThirdPayChannelOrderId`, `OldFrontSequenceNumber`, `CurrencyAmount`, `CurrencyUnit`, `CurrencyType`, `MidasEnvironment` |
| `CreateOpenBankVerificationOrder` | Create open bank verification order<br>Required: `ChannelMerchantId`, `OutVerificationId`, `VerificationAmount` |
| `ApplyReWithdrawal` | Run apply re withdrawal<br>Required: `BusinessType`, `MidasSecretId`, `MidasSignature`, `Body`, `MidasAppId` |
| `DistributeRemoveReceiver` | Distribute remove receiver<br>Required: `OpenId`, `OpenKey`, `MerchantNo` |
| `ApplyPayerInfo` | Run apply payer info<br>Required: `PayerId`, `PayerType`, `PayerName`, `PayerIdType`, `PayerIdNo`, `PayerCountryCode` |
| `ApplyTrade` | Run apply trade<br>Required: `TradeFileId`, `TradeOrderId`, `PayerId`, `PayeeName`, `PayeeCountryCode`, `TradeType`, `TradeTime` (format `yyyyMMdd…`), `TradeCurrency`, `TradeAmount`, `TradeName`, `TradeCount` |
| `UnbindOpenBankExternalSubMerchantBankAccount` | Unbind open bank external sub merchant bank account<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod`, `BindSerialNo`, `OutApplyId` |
| `CreateOpenBankMerchant` | Create open bank merchant<br>Required: `OutMerchantId`, `ChannelName`, `OutMerchantName`, `ExternalMerchantInfo` |
| `CreateRedInvoice` | Create red invoice<br>Required: `InvoicePlatformId`, `Invoices` |
| `Refund` | Run refund<br>Required: `UserId`, `RefundId`, `MidasAppId`, `TotalRefundAmt`, `MidasSecretId`, `MidasSignature` |
| `CloseOpenBankPaymentOrder` | Close open bank payment order<br>Required: `ChannelMerchantId` |
| `RefundCloudOrder` | Refund cloud order<br>Required: `MidasAppId`, `UserId`, `RefundId`, `TotalRefundAmt` (unit: 0), `OutTradeNo` |
| `DistributeAccreditTlinx` | Distribute accredit tlinx<br>Required: `OpenId`, `OpenKey`, `AuthType` |
| `RechargeByThirdPay` | Run recharge by third pay<br>Required: `RequestType`, `MerchantCode`, `PayChannel`, `PayChannelSubId`, `OrderId`, `BankAccountNumber`, `PlatformShortNumber`, `MidasSecretId`, `MidasAppId`, `MidasSignature`, `TransSequenceNumber`, `BankSubAccountNumber`, `TransFee`, `ThirdPayChannel`, `ThirdPayChannelMerchantCode`, `ThirdPayChannelOrderId`, `CurrencyAmount`, `CurrencyUnit`, `CurrencyType`, `TransNetMemberCode`, `MidasEnvironment` |
| `RechargeMemberThirdPay` | Run recharge member third pay<br>Required: `TranNetMemberCode`, `MemberFillAmt`, `Commission`, `Ccy`, `PayChannelType`, `PayChannelAssignMerNo`, `PayChannelTranSeqNo`, `EjzbOrderNo`, `MrchCode` |
| `CreateMerchant` | Create merchant<br>Required: `InvoicePlatformId`, `TaxpayerName`, `TaxpayerNum`, `LegalPersonName`, `ContactsName`, `Phone`, `Address`, `RegionCode`, `CityName`, `Drawer`, `TaxRegistrationCertificate` |
| `CreateAcct` | Create acct<br>Required: `MidasAppId`, `SubMchId`, `SubMchName`, `Address`, `Contact`, `Mobile`, `Email`, `MidasSecretId`, `MidasSignature` |
| `ExecuteMemberTransaction` | Execute member transaction<br>Required: `RequestType`, `MerchantCode`, `PayChannel`, `PayChannelSubId`, `OutTransNetMemberCode`, `OutSubAccountName`, `InSubAccountName`, `OutSubAccountNumber`, `InSubAccountNumber`, `BankAccountNumber`, `CurrencyUnit`, `CurrencyType`, `CurrencyAmount`, `OrderId`, `MidasAppId`, `MidasSecretId`, `MidasSignature`, `TransSequenceNumber`, `InTransNetMemberCode`, `MidasEnvironment` |
| `DistributeQuery` | Distribute query<br>Required: `OpenId`, `OpenKey`, `Type` |
| `CreateOpenBankSubMerchantRateConfigure` | Create open bank sub merchant rate configure<br>Required: `ChannelRegistrationNo`, `OutProductFeeNo`, `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PayType`, `PayChannel`, `FeeMode`, `FeeValue` |
| `CreateSinglePayment` | Create single payment<br>Required: `TransferType`, `OrderId`, `TransferAmount`, `AnchorId` |
| `RegisterBill` | Register bill<br>Required: `RequestType`, `MerchantCode`, `PayChannel`, `PayChannelSubId`, `OrderId`, `BankAccountNo`, `PlatformShortNo`, `MidasSecretId`, `MidasAppId`, `MidasSignature`, `TransSeqNo`, `TranFee` (default 0.0), `OrderAmt`, `BankSubAccountNo`, `TranNetMemberCode`, `TranType` |
| `ApplyWithdrawal` | Run apply withdrawal<br>Required: `MidasAppId`, `SubAppId`, `SettleAcctNo`, `SettleAcctName`, `CurrencyType`, `CurrencyUnit`, `CurrencyAmt`, `TranWebName`, `IdType`, `IdCode`, `MidasSecretId`, `MidasSignature` |
| `CreateCustAcctId` | Create cust acct id<br>Required: `FunctionFlag`, `FundSummaryAcctNo`, `TranNetMemberCode`, `MemberProperty`, `Mobile`, `MrchCode`, `SelfBusiness`, `ContactName`, `SubAcctName`, `SubAcctShortName`, `SubAcctType` |
| `UploadFile` | Upload file<br>Required: `FileName`, `FileType` |
| `CloseOrder` | Close order<br>Required: `MidasAppId`, `UserId`, `MidasSecretId`, `MidasSignature` |
| `RevokeMemberRechargeThirdPay` | Revoke member recharge third pay<br>Required: `OldFillFrontSeqNo`, `OldFillPayChannelType`, `OldPayChannelTranSeqNo`, `OldFillEjzbOrderNo`, `ApplyCancelMemberAmt`, `ApplyCancelCommission`, `MrchCode` |
| `DistributeCancel` | Distribute cancel<br>Required: `OpenId`, `OpenKey`, `OrderNo` |
| `BindRelateAcctUnionPay` | Bind relate acct union pay<br>Required: `TranNetMemberCode`, `MemberName`, `MemberGlobalType`, `MemberGlobalId`, `MemberAcctNo`, `BankType`, `AcctOpenBranchName`, `Mobile`, `MrchCode` |
| `UploadOpenBankSubMerchantCredential` | Upload open bank sub merchant credential<br>Required: `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `OutApplyId`, `CredentialType`, `FileType` |
| `DistributeQueryReceiver` | Distribute query receiver<br>Required: `OpenId`, `OpenKey` |
| `ApplyOpenBankSettleOrder` | Run apply open bank settle order<br>Required: `ChannelMerchantId`, `OutSettleId`, `SettleAmount`, `ChannelName` |
| `CreateInvoice` | Create invoice<br>Required: `InvoicePlatformId`, `TitleType`, `BuyerTitle`, `OrderId`, `AmountHasTax`, `TaxAmount`, `AmountWithoutTax` (default 1), `SellerTaxpayerNum` |
| `DistributeAddReceiver` | Distribute add receiver<br>Required: `OpenId`, `OpenKey`, `MerchantNo` |
| `RefundMemberTransaction` | Refund member transaction<br>Required: `OutSubAccountName`, `InSubAccountName`, `PayChannelSubId`, `OutSubAccountNumber`, `MidasSignature`, `InSubAccountNumber`, `MidasSecretId`, `BankAccountNumber`, `OldTransSequenceNumber`, `MerchantCode`, `RequestType`, `CurrencyAmount`, `TransSequenceNumber`, `PayChannel`, `OldOrderId`, `MidasAppId`, `OrderId`, `MidasEnvironment` |
| `AddMerchant` | Add merchant<br>Required: `OpenId`, `OpenKey`, `OutMerchantId`, `MerchantName`, `BusinessLicenseType`, `BusinessLicenseNo`, `BusinessLicensePicture`, `BusinessLicenseStartDate`, `BusinessLicenseEndDate`, `ClassificationIds`, `BrandName`, `Telephone`, `CityId`, `Address`, `OpenHours`, `AccountType`, `BankNo`, `BankName`, `AccountNo`, `AccountName`, `BossIdType`, `BossIdNo`, `BossName`, `BossSex`, `BossIdCountry`, `BossPositive`, `BossBack`, `BossStartDate`, `BossEndDate`, `LicencePicture` |
| `MigrateOrderRefundQuery` | Migrate order refund query<br>Required: `MerchantId`, `PayChannel`, `RefundOrderId`, `TradeSerialNo` |
| `ApplyOutwardOrder` | Run apply outward order<br>Required: `TransactionId`, `PricingCurrency`, `SourceCurrency`, `TargetCurrency`, `PayeeType`, `PayeeAccount` |
| `AddFlexFundingAccount` | Add flex funding account<br>Required: `FundingAccountType`, `FundingAccountName`, `FundingAccountNo`, `PhoneNo`, `PayeeId` |
| `UnifiedCloudOrder` | Run unified cloud order<br>Required: `MidasAppId`, `UserId`, `OutTradeNo`, `CurrencyType`, `ProductId`, `ProductName`, `ProductDetail`, `OriginalAmt`, `TotalAmt` |
| `CreateOpenBankExternalSubMerchantAccountBook` | Create open bank external sub merchant account book<br>Required: `OutAccountBookId`, `ChannelMerchantId`, `ChannelSubMerchantId`, `ChannelName`, `PaymentMethod` |
| `ApplyFlexSettlement` | Run apply flex settlement<br>Required: `PayeeId`, `IncomeType`, `AmountBeforeTax`, `OutOrderId`, `Remark` |
| `CreateOpenBankAggregatedSubMerchantRegistration` | Create open bank aggregated sub merchant registration<br>Required: `OutRegistrationNo`, `ChannelMerchantId`, `OutSubMerchantId`, `ChannelName`, `OutSubMerchantType`, `OutSubMerchantName`, `LegalPersonInfo`, `BusinessLicenseInfo`, `InterConnectionSubMerchantData` |
| `CloseCloudOrder` | Close cloud order<br>Required: `MidasAppId`, `UserId`, `OutTradeNo` |
| `RefundOrder` | Refund order<br>Required: `MerchantAppId`, `OrderNo` |

## Blocked destructive actions (9)

`ModifyAgentTaxPaymentInfo`, `ModifyMntMbrBindRelateAcctBankCode`, `ModifyMerchant`, `DeleteAgentTaxPaymentInfo`, `DeleteAgentTaxPaymentInfos`, `ModifyBindedAccount`, `ModifyFlexPayeeAccountRightStatus`, `ModifyFlexFundingAccount`, `TerminateContract` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cpdp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190820` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cpdp"`) for the allow/block decision and reason.
