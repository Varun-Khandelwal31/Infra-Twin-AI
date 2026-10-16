// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InfraTwinRegistry
 * @dev Immutable on-chain registry for autonomous drone road inspections,
 *      Section 65B electronic audit certificates, and LiDAR volumetric Merkle roots.
 *      Compliant with MoRTH / NHAI / NDMC digital governance standards.
 */
contract InfraTwinRegistry {
    address public municipalAdmin;
    address public certifiedAIOracle;

    struct InspectionRecord {
        string inspectionId;
        string roadId;
        string cityZone;
        bytes32 merkleRoot;
        bytes32 section65BDigest;
        uint256 pciScore;
        uint256 detectedPotholes;
        uint256 totalVolumeCum; // scaled by 1000 (e.g. 746 = 0.746 m3)
        uint256 timestamp;
        address auditor;
        bool isVerified;
    }

    // Mapping from inspectionId -> InspectionRecord
    mapping(string => InspectionRecord) private _inspections;
    string[] private _allInspectionIds;

    event InspectionAnchored(
        string indexed inspectionId,
        string indexed roadId,
        bytes32 merkleRoot,
        bytes32 section65BDigest,
        uint256 pciScore,
        uint256 timestamp,
        address indexed auditor
    );

    event CertificateRevoked(string indexed inspectionId, string reason);

    modifier onlyAuthorized() {
        require(
            msg.sender == municipalAdmin || msg.sender == certifiedAIOracle,
            "InfraTwin: Caller is not municipal admin or certified AI oracle"
        );
        _;
    }

    constructor(address _aiOracle) {
        municipalAdmin = msg.sender;
        certifiedAIOracle = _aiOracle;
    }

    /**
     * @notice Anchor a verified drone LiDAR & RGB inspection record to the blockchain
     */
    function anchorInspection(
        string calldata _inspectionId,
        string calldata _roadId,
        string calldata _cityZone,
        bytes32 _merkleRoot,
        bytes32 _section65BDigest,
        uint256 _pciScore,
        uint256 _detectedPotholes,
        uint256 _totalVolumeCum
    ) external onlyAuthorized {
        require(!_inspections[_inspectionId].isVerified, "InfraTwin: Inspection already anchored");

        _inspections[_inspectionId] = InspectionRecord({
            inspectionId: _inspectionId,
            roadId: _roadId,
            cityZone: _cityZone,
            merkleRoot: _merkleRoot,
            section65BDigest: _section65BDigest,
            pciScore: _pciScore,
            detectedPotholes: _detectedPotholes,
            totalVolumeCum: _totalVolumeCum,
            timestamp: block.timestamp,
            auditor: msg.sender,
            isVerified: true
        });

        _allInspectionIds.push(_inspectionId);

        emit InspectionAnchored(
            _inspectionId,
            _roadId,
            _merkleRoot,
            _section65BDigest,
            _pciScore,
            block.timestamp,
            msg.sender
        );
    }

    /**
     * @notice Fetch an inspection record by ID for legal provenance verification
     */
    function getInspection(string calldata _inspectionId)
        external
        view
        returns (InspectionRecord memory)
    {
        require(_inspections[_inspectionId].isVerified, "InfraTwin: Record not found");
        return _inspections[_inspectionId];
    }

    /**
     * @notice Get total number of anchored inspections on-chain
     */
    function getTotalInspections() external view returns (uint256) {
        return _allInspectionIds.length;
    }
}
