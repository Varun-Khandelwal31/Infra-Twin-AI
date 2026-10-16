// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InfraEscrow
 * @dev Automated Smart Contract for Municipal Road Tender Milestone Payments and SLA Governance.
 *      Integrates directly with Public Financial Management System (PFMS) & GeM Escrow.
 *      Releases payments autonomously when AI confirms compliance; freezes & slashes upon fraud.
 */
contract InfraEscrow {
    address public municipalAuthority;
    address public aiOracle;

    enum EscrowState {
        CREATED,
        FUNDED,
        UNDER_AUDIT,
        APPROVED_RELEASED,
        PAYMENT_FROZEN,
        SLASHED
    }

    struct TenderWorkOrder {
        string workOrderId;
        string roadId;
        address payable contractor;
        uint256 totalBudgetWei;
        uint256 milestone1PaidWei;
        uint256 milestone2PaidWei;
        uint256 retentionAmountWei; // 10% Defect Liability Period retention
        bytes32 inspectionMerkleRoot;
        uint256 compactionDensityPct; // Must be >= 95
        uint256 materialVariancePct;  // Must be <= 5
        EscrowState state;
        uint256 fundedAt;
        uint256 auditedAt;
    }

    mapping(string => TenderWorkOrder) public workOrders;
    string[] public workOrderIds;

    event WorkOrderFunded(string indexed workOrderId, address contractor, uint256 amount);
    event MilestoneReleased(string indexed workOrderId, address contractor, uint256 amount, uint256 milestoneNumber);
    event PaymentFrozenFraud(string indexed workOrderId, address contractor, string reason, uint256 variancePct);
    event ContractorSlashed(string indexed workOrderId, address contractor, uint256 slashedAmount);

    modifier onlyAuthority() {
        require(msg.sender == municipalAuthority, "InfraEscrow: Municipal Chief Engineer only");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == aiOracle, "InfraEscrow: Certified AI Oracle only");
        _;
    }

    constructor(address _aiOracle) {
        municipalAuthority = msg.sender;
        aiOracle = _aiOracle;
    }

    /**
     * @notice Deposit municipal budget into escrow for a specific tender work order
     */
    function fundWorkOrder(
        string calldata _woId,
        string calldata _roadId,
        address payable _contractor
    ) external payable onlyAuthority {
        require(msg.value > 0, "InfraEscrow: Must fund with non-zero budget");
        require(workOrders[_woId].contractor == address(0), "InfraEscrow: WO already exists");

        uint256 retention = (msg.value * 10) / 100; // 10% DLP warranty hold

        workOrders[_woId] = TenderWorkOrder({
            workOrderId: _woId,
            roadId: _roadId,
            contractor: _contractor,
            totalBudgetWei: msg.value,
            milestone1PaidWei: 0,
            milestone2PaidWei: 0,
            retentionAmountWei: retention,
            inspectionMerkleRoot: bytes32(0),
            compactionDensityPct: 0,
            materialVariancePct: 0,
            state: EscrowState.FUNDED,
            fundedAt: block.timestamp,
            auditedAt: 0
        });

        workOrderIds.push(_woId);
        emit WorkOrderFunded(_woId, _contractor, msg.value);
    }

    /**
     * @notice AI Oracle submits autonomous drone volumetric differencing & compaction audit
     */
    function submitAIAuditResults(
        string calldata _woId,
        bytes32 _merkleRoot,
        uint256 _compactionDensityPct,
        uint256 _materialVariancePct
    ) external onlyOracle {
        TenderWorkOrder storage wo = workOrders[_woId];
        require(
            wo.state == EscrowState.FUNDED || wo.state == EscrowState.UNDER_AUDIT,
            "InfraEscrow: Invalid work order state for audit"
        );

        wo.inspectionMerkleRoot = _merkleRoot;
        wo.compactionDensityPct = _compactionDensityPct;
        wo.materialVariancePct = _materialVariancePct;
        wo.auditedAt = block.timestamp;

        // Autonomous Rule Evaluation (IRC:82 MoRTH Specification)
        if (_compactionDensityPct >= 95 && _materialVariancePct <= 5) {
            // Milestone 1: 50% payout of total available budget
            wo.state = EscrowState.APPROVED_RELEASED;
            uint256 payout = (wo.totalBudgetWei - wo.retentionAmountWei) / 2;
            wo.milestone1PaidWei = payout;

            (bool success, ) = wo.contractor.call{value: payout}("");
            require(success, "InfraEscrow: Transfer failed");

            emit MilestoneReleased(_woId, wo.contractor, payout, 1);
        } else {
            // Material Over-Billing or Compaction Deficit Detected
            wo.state = EscrowState.PAYMENT_FROZEN;
            emit PaymentFrozenFraud(
                _woId,
                wo.contractor,
                "Material variance exceeds +/-5% or compaction density below 95%",
                _materialVariancePct
            );
        }
    }

    /**
     * @notice Slashes contractor bond and returns funds to municipal treasury if fraud confirmed
     */
    function slashContractor(string calldata _woId) external onlyAuthority {
        TenderWorkOrder storage wo = workOrders[_woId];
        require(wo.state == EscrowState.PAYMENT_FROZEN, "InfraEscrow: Must be frozen first");

        wo.state = EscrowState.SLASHED;
        uint256 remainingFunds = address(this).balance;

        (bool success, ) = payable(municipalAuthority).call{value: remainingFunds}("");
        require(success, "InfraEscrow: Treasury refund failed");

        emit ContractorSlashed(_woId, wo.contractor, remainingFunds);
    }
}
