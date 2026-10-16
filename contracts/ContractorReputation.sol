// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContractorReputation
 * @dev On-chain dynamic reputation and credit scoring for Indian highway contractors.
 *      Tracks Defect Liability Period (DLP) survival rate, audit passes, and fraud penalties.
 */
contract ContractorReputation {
    address public municipalAuthority;

    struct ContractorProfile {
        string name;
        string licenseNumber;
        uint256 trustScore; // 0 to 100
        uint256 completedProjects;
        uint256 passedAudits;
        uint256 failedAudits;
        uint256 fraudPenalties;
        uint256 totalBudgetExecutedWei;
        bool isBlacklisted;
    }

    mapping(address => ContractorProfile) public contractors;
    address[] public contractorList;

    event ReputationUpdated(address indexed contractor, uint256 newScore, string reason);
    event ContractorBlacklisted(address indexed contractor, string reason);

    modifier onlyAuthority() {
        require(msg.sender == municipalAuthority, "ContractorReputation: Municipal Chief Engineer only");
        _;
    }

    constructor() {
        municipalAuthority = msg.sender;
    }

    function registerContractor(
        address _contractor,
        string calldata _name,
        string calldata _license
    ) external onlyAuthority {
        require(bytes(contractors[_contractor].name).length == 0, "Already registered");

        contractors[_contractor] = ContractorProfile({
            name: _name,
            licenseNumber: _license,
            trustScore: 85, // Default baseline score
            completedProjects: 0,
            passedAudits: 0,
            failedAudits: 0,
            fraudPenalties: 0,
            totalBudgetExecutedWei: 0,
            isBlacklisted: false
        });

        contractorList.push(_contractor);
    }

    function recordAuditResult(
        address _contractor,
        bool _passed,
        bool _isFraud,
        uint256 _projectBudgetWei
    ) external onlyAuthority {
        ContractorProfile storage c = contractors[_contractor];
        require(bytes(c.name).length > 0, "Contractor not registered");

        if (_passed) {
            c.passedAudits += 1;
            c.completedProjects += 1;
            c.totalBudgetExecutedWei += _projectBudgetWei;
            if (c.trustScore < 98) {
                c.trustScore += 2;
            }
            emit ReputationUpdated(_contractor, c.trustScore, "Passed autonomous AI volumetric audit");
        } else {
            c.failedAudits += 1;
            if (_isFraud) {
                c.fraudPenalties += 1;
                c.trustScore = c.trustScore > 25 ? c.trustScore - 25 : 0;
                if (c.trustScore <= 30) {
                    c.isBlacklisted = true;
                    emit ContractorBlacklisted(_contractor, "Trust score fallen below municipal threshold");
                }
                emit ReputationUpdated(_contractor, c.trustScore, "Material over-billing fraud detected");
            } else {
                c.trustScore = c.trustScore > 5 ? c.trustScore - 5 : 0;
                emit ReputationUpdated(_contractor, c.trustScore, "Minor compaction defect");
            }
        }
    }
}
