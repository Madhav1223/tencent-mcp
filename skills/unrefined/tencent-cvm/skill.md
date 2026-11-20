---
name: tencent-cvm
description: Manages Tencent Cloud virtual machines (CVM) — instances, images, key pairs, security groups, disks, placement groups, and price inquiry. Use for any VM lifecycle, inventory, or cost-estimate task. Triggers on mentions of CVM, EC2, instance, VM, image, key pair, security group, placement group, or server. Describe/InquiryPrice actions pass automatically; Start/Stop/Reboot/Terminate/Reset/Modify and RunInstances are gated or denied.
metadata:
  version: "1"
---

# Tencent Cloud CVM

Virtual machines: instances, images, keys, security groups, disks, and pricing. API version `v20170312`.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cvm"`, region pinned per call (instances live in availability zones, e.g. `ap-singapore-1`).

## Procedures

| User need | Do this |
|---|---|
| Inventory VMs | `DescribeInstances` with `{"Limit": 20}` (+ `Filters` on `instance-id`, `instance-name`, `zone`, or `instance-charge-type`) |
| Check a VM's state before acting | `DescribeInstancesStatus` with `{"InstanceIds": ["ins-xxxx"]}` |
| Estimate cost before creating | `InquiryPriceRunInstances` with the exact `InstanceType`, `ImageId`, `SystemDisk`, and charge type — never quote without this |
| What sizes are available in a zone | `DescribeInstanceTypeConfigs` + `DescribeZoneInstanceConfigInfos` with `{"Zones": ["ap-singapore-1"]}` |
| Account limits / quotas | `DescribeAccountQuota` |
| Allowed operations on an instance | `DescribeInstancesOperationLimit` — states what the current instance status permits |
| Keys and images | `DescribeKeyPairs`, `DescribeImages` (`ImageType`: `PUBLIC_IMAGE`, `SHARED_IMAGE`, `PRIVATE_IMAGE`) |
| Security groups on instances | `DescribeInstancesAttributes` is not the path — use `vpc:DescribeAssociateSecurityGroups`-style VPC calls; in `cvm`, attach/detach via `AssociateSecurityGroups` — **gated** |

## Safety

- **Auto-allowed:** `Describe*`, `InquiryPrice*`, `Get*`-style reads.
- **Denied outright:** `TerminateInstances` (`Terminate` prefix), `StopInstances` (`Stop`), `ResetInstance*` / `ResetInstances*` (`Reset`), `RebootInstances` is **not** in the deny list but is not readonly either — it is gated (see below).
- **Gated (needs `TENCENT_MCP_ALLOW_MUTATIONS`, e.g. `cvm:StartInstances`):** `RunInstances`, `StartInstances`, `RebootInstances`, `ModifyInstancesAttribute`, `ResizeInstanceDisks`, `RenewInstances`, `AllocateHosts`, key/image creation. Password resets (`ResetInstancesPassword`) are denied — use console for those.
- Creating VMs costs real money. Always run the matching `InquiryPrice*` first and state the estimate before any `RunInstances`.

## Mistakes to avoid

- **Instance IDs are zone-scoped.** `DescribeInstances` in `ap-singapore` will not find `ins-xxxx` from `ap-guangzhou` — match the region to the resource, don't assume the default.
- `RunInstances` requires `Placement: {"Zone": "..."}` plus `ImageId` and login settings (`KeyIds` or `Password`) — omitting login settings is the most common failure.
- `InstanceChargeType` (`POSTPAID_BY_HOUR` vs `PREPAID`) changes the required params (prepaid needs `InstanceChargePrepaid: {"Period": n}`).
- Filters use `{"Name": "...", "Values": ["..."]}` objects — a bare string filter silently matches nothing.

## Verify

- After `RunInstances`, poll `DescribeInstancesStatus` until `RUNNING` — creation is asynchronous.
- After any modify call, re-run `DescribeInstances` on the ID and diff the fields; the API returns success even when an attribute change is still propagating.
